/**
 * UniDash HAC Proxy — GitHub Codespaces
 * Node.js replication of ironmike1974/RRISD-HAC-Reminders (C# → JS)
 * 
 * Endpoints:
 *   POST   /hac/login            → { sessionId }
 *   GET    /hac/grades           → { courses[] }
 *   GET    /hac/students         → { students[] }
 *   POST   /hac/change-student   → { success }
 *   DELETE /hac/logout           → { success }
 *   GET    /health               → { ok }
 */

const express  = require('express');
const axios    = require('axios');
const { wrapper }    = require('axios-cookiejar-support');
const { CookieJar }  = require('tough-cookie');
const cheerio  = require('cheerio');
const cors     = require('cors');

const app      = express();
const HAC_BASE = 'https://accesscenter.roundrockisd.org/HomeAccess';

app.use(cors());           // Allow your UniDash origin
app.use(express.json());
app.use(express.static(__dirname));

// ------------------------------------------------------------------
// In-memory sessions:  sessionId → { jar, baseUrl }
// Mirrors C#'s CookieContainer pattern from the original library
// ------------------------------------------------------------------
const sessions = {};

function makeClient(jar) {
    return wrapper(axios.create({
        jar,
        withCredentials: true,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    }));
}

// ------------------------------------------------------------------
// POST /hac/login
// Body: { username, password }
// Mirrors: HAC.login(username, password, out CookieContainer)
// ------------------------------------------------------------------
app.post('/hac/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Missing credentials' });

    try {
        const jar    = new CookieJar();
        const client = makeClient(jar);

        // Step 1: GET login page → scrape anti-forgery token
        const loginPage = await client.get(`${HAC_BASE}/Account/LogOn`);
        const $         = cheerio.load(loginPage.data);
        const token     = $('input[name="__RequestVerificationToken"]').val();
        if (!token) throw new Error('Verification token not found — HAC page may have changed.');

        // Step 2: POST credentials  (same fields the C# lib sends)
        const body = new URLSearchParams({
            '__RequestVerificationToken'  : token,
            'SCKTY00328510CustomEnabled'  : 'False',
            'SCKTY00436568CustomEnabled'  : 'False',
            'Database'                    : '10',
            'VerificationOption'          : 'UsernamePassword',
            'LogOnDetails.UserName'       : username,
            'LogOnDetails.Password'       : password,
        });

        const loginRes  = await client.post(`${HAC_BASE}/Account/LogOn`, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Step 3: Detect failure (HAC shows "Invalid" message on bad creds)
        const $login = cheerio.load(loginRes.data);
        const errMsg = $login('.validation-summary-errors li').text().trim();
        if (errMsg) return res.status(401).json({ error: errMsg || 'Invalid username or password.' });

        // Step 4: Derive the canonical base URL from the post-login redirect
        const responseUrl = loginRes.request?.res?.responseUrl || loginRes.config?.url || HAC_BASE;
        const parsedBase  = new URL(responseUrl);
        const baseUrl     = `${parsedBase.protocol}//${parsedBase.host}/HomeAccess`;

        const sessionId = crypto.randomUUID();
        sessions[sessionId] = { jar, baseUrl };

        console.log(`[+] Login OK for user "${username}" → session ${sessionId}`);
        res.json({ sessionId, success: true });

    } catch (err) {
        console.error('[login]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ------------------------------------------------------------------
// GET /hac/grades?sessionId=xxx
// Mirrors: HAC.getAssignments() + AssignmentUtils.organizeAssignments()
// ------------------------------------------------------------------
app.get('/hac/grades', async (req, res) => {
    const session = sessions[req.query.sessionId];
    if (!session) return res.status(401).json({ error: 'Session not found. Please log in again.' });

    try {
        const client   = makeClient(session.jar);
        const response = await client.get(`${session.baseUrl}/Classes/Classwork`);
        const courses  = parseGrades(response.data);
        res.json({ courses });
    } catch (err) {
        console.error('[grades]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ------------------------------------------------------------------
// GET /hac/students?sessionId=xxx
// Mirrors: HAC.getStudents()
// ------------------------------------------------------------------
app.get('/hac/students', async (req, res) => {
    const session = sessions[req.query.sessionId];
    if (!session) return res.status(401).json({ error: 'Session not found.' });

    try {
        const client   = makeClient(session.jar);
        // The student switcher lives in the top nav dropdown
        const response = await client.get(`${session.baseUrl}/Home/WeekView`);
        const $        = cheerio.load(response.data);

        const students = [];
        // HAC renders student list as <li data-student-id="...">
        $('[data-student-id]').each((_, el) => {
            const id   = $(el).attr('data-student-id') || $(el).val();
            const name = $(el).find('.sg-student-name, .sg-header-sub').first().text().trim()
                      || $(el).text().trim();
            if (id) students.push({ id, name });
        });

        // Fallback: check the <select> student picker if the above finds nothing
        if (!students.length) {
            $('select[name*="student"] option, select[id*="student"] option').each((_, el) => {
                const id   = $(el).attr('value');
                const name = $(el).text().trim();
                if (id && name) students.push({ id, name });
            });
        }

        res.json({ students });
    } catch (err) {
        console.error('[students]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ------------------------------------------------------------------
// POST /hac/change-student
// Body: { sessionId, studentId }
// Mirrors: HAC.changeStudent(studentId, cookieContainer, responseUri)
// ------------------------------------------------------------------
app.post('/hac/change-student', async (req, res) => {
    const { sessionId, studentId } = req.body;
    const session = sessions[sessionId];
    if (!session) return res.status(401).json({ error: 'Session not found.' });

    try {
        const client = makeClient(session.jar);
        await client.get(`${session.baseUrl}/Home/ChangeStudent?studentId=${encodeURIComponent(studentId)}`);
        console.log(`[~] Switched to student ID ${studentId}`);
        res.json({ success: true });
    } catch (err) {
        console.error('[change-student]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ------------------------------------------------------------------
// DELETE /hac/logout
// Body: { sessionId }
// ------------------------------------------------------------------
app.delete('/hac/logout', (req, res) => {
    const { sessionId } = req.body;
    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
        console.log(`[-] Session ${sessionId} destroyed`);
    }
    res.json({ success: true });
});

// Health check — lets UniDash verify the proxy is alive
app.get('/health', (_, res) => res.json({ ok: true, sessions: Object.keys(sessions).length }));

// ------------------------------------------------------------------
// HTML PARSER — mirrors C# getAssignments() + organizeAssignments()
// ------------------------------------------------------------------
function parseGrades(html) {
    const $       = cheerio.load(html);
    const courses = [];

    $('.AssignmentClass').each((_, block) => {
        const hdrCells   = $(block).find('.ClassHeader tr td');
        const courseName = $(hdrCells[0]).text().trim() || 'Unknown';
        const average    = $(hdrCells[1]).text().trim() || '—';
        const teacher    = $(hdrCells[2]).text().trim() || '';
        const period     = $(hdrCells[3]).text().trim() || '';

        const assignments = [];
        $(block).find('.AssignmentRow').each((_, row) => {
            const cols = $(row).find('td');
            assignments.push({
                name     : $(cols[0]).text().trim(),
                dateAssigned: $(cols[1]).text().trim(),
                due      : $(cols[2]).text().trim(),
                category : $(cols[3]).text().trim(),
                score    : $(cols[4]).text().trim(),
                max      : $(cols[5]).text().trim(),
                // Computed % — mirrors (assignment.points/assignment.maxPoints)*100
                pct      : computePct($(cols[4]).text().trim(), $(cols[5]).text().trim()),
            });
        });

        courses.push({ courseName, average, teacher, period, assignments });
    });

    return courses;
}

function computePct(score, max) {
    const s = parseFloat(score);
    const m = parseFloat(max);
    if (isNaN(s) || isNaN(m) || m === 0) return null;
    return Math.round((s / m) * 1000) / 10; // one decimal
}

const fs = require('fs');
const path = require('path');

// Gemini AI integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
let genAI = null;
try {
    // Try to load service account key
    const keyPath = path.join(__dirname, 'ai-admin-key.json');
    if (fs.existsSync(keyPath)) {
        const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        genAI = new GoogleGenerativeAI(keyData.private_key);
        console.log('✓ Gemini AI client initialized');
    } else {
        console.log('⚠ Gemini key file not found - AI features will be disabled');
    }
} catch (error) {
    console.error('Error initializing Gemini client:', error.message);
}

app.post('/canvas/proxy', async (req, res) => {
    const { baseUrl, path, accessToken, method = 'GET', body } = req.body;

    if (!baseUrl || !path || !accessToken) {
        return res.status(400).json({ error: 'Missing Canvas proxy parameters.' });
    }

    try {
        const url = `${baseUrl.replace(/\/$/, '')}${path}`;
        console.log(`[canvas/proxy] ${method} ${url}`);
        const response = await axios({
            url,
            method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
            data: body || undefined,
            validateStatus: () => true
        });

        console.log(`[canvas/proxy] Response status: ${response.status}`);
        if (response.headers['content-type']?.includes('application/json')) {
            return res.status(response.status).json(response.data);
        }

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('[canvas/proxy]', error.message, error.response?.data || '');
        const status = error.response?.status || 500;
        return res.status(status).json({ error: error.message, details: error.response?.data });
    }
});

app.post('/api/gemini/generate-tasks', async (req, res) => {
    if (!genAI) {
        return res.status(503).json({ error: 'Gemini AI not configured. Please add ai-admin-key.json file.' });
    }

    const { canvasAssignments, emailSummaries, existingTasks } = req.body;

    if (!canvasAssignments && !emailSummaries) {
        return res.status(400).json({ error: 'No context provided for AI generation.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build context from Canvas and email data
        let context = 'Generate a personalized study plan and todo list based on the following context:\n\n';

        if (canvasAssignments && canvasAssignments.length > 0) {
            context += 'CANVAS ASSIGNMENTS:\n';
            canvasAssignments.slice(0, 5).forEach((assignment, i) => {
                const dueDate = assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : 'No due date';
                context += `${i + 1}. ${assignment.name || 'Assignment'} - Due: ${dueDate} - Course: ${assignment.context_name || 'Unknown'}\n`;
            });
            context += '\n';
        }

        if (emailSummaries && emailSummaries.length > 0) {
            context += 'RECENT EMAILS:\n';
            emailSummaries.slice(0, 3).forEach((email, i) => {
                context += `${i + 1}. ${email.subject} from ${email.from} - ${email.snippet || 'No preview'}\n`;
            });
            context += '\n';
        }

        if (existingTasks && existingTasks.length > 0) {
            context += 'EXISTING TASKS:\n';
            existingTasks.forEach((task, i) => {
                context += `${i + 1}. ${task.title} - ${task.details}\n`;
            });
            context += '\n';
        }

        const prompt = `${context}
Please generate 5-8 specific, actionable study tasks or todo items. For each task, provide:
- A clear, concise title
- Detailed instructions or steps
- Priority level (High/Medium/Low)
- Estimated time to complete
- Why this task is important based on the context

Format your response as a JSON array of objects with keys: title, details, priority, estimatedTime, importance.

Focus on helping the student stay organized, prepare for upcoming assignments, and maintain good study habits.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse as JSON, fallback to text processing
        let tasks = [];
        try {
            // Clean up the response to extract JSON
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                tasks = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found');
            }
        } catch (parseError) {
            // Fallback: create tasks from text response
            console.log('Failed to parse Gemini response as JSON, using fallback');
            tasks = [{
                title: 'AI Task Generation',
                details: 'Gemini provided recommendations but response format needs adjustment.',
                priority: 'Medium',
                estimatedTime: '15 minutes',
                importance: 'Review AI suggestions manually'
            }];
        }

        res.json({
            success: true,
            tasks: tasks,
            rawResponse: text
        });

    } catch (error) {
        console.error('[gemini/generate-tasks]', error.message);
        res.status(500).json({
            error: 'Failed to generate AI tasks',
            details: error.message
        });
    }
});

app.get('/api/pages', (req, res) => {
    const pagesDir = path.join(__dirname, 'pages');
    fs.readdir(pagesDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Cannot scan directory" });
        
        // Filter for .html files and format the names
        const pages = files
            .filter(file => file.endsWith('.html'))
            .map(file => {
                const id = file.replace('.html', '');
                return {
                    id: id,
                    name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize
                    icon: "fa-rocket" // Default icon
                };
            });
        res.json(pages);
    });
});

// ------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✓ HAC Proxy listening on port ${PORT}`));