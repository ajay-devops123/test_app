const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);

// ============================================
// APP BUILDER API ENDPOINTS
// ============================================

// GET all projects
app.get("/api/projects", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("app-builder-db");
        const projects = await db.collection('projects').find({}).toArray();
        
        res.json({
            success: true,
            count: projects.length,
            projects: projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects'
        });
    } finally {
        await client.close();
    }
});

// GET single project by ID
app.get("/api/projects/:id", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("app-builder-db");
        const project = await db.collection('projects').findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        
        res.json({
            success: true,
            project: project
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project'
        });
    } finally {
        await client.close();
    }
});

// POST create new project
app.post("/api/projects", async (req, res) => {
    const projectData = {
        name: req.body.name || 'Untitled Project',
        description: req.body.description || '',
        components: req.body.components || [],
        styles: req.body.styles || {},
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    try {
        await client.connect();
        const db = client.db("app-builder-db");
        const result = await db.collection('projects').insertOne(projectData);
        
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            projectId: result.insertedId,
            project: { ...projectData, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project'
        });
    } finally {
        await client.close();
    }
});

// PUT update existing project
app.put("/api/projects/:id", async (req, res) => {
    const updateData = {
        name: req.body.name,
        description: req.body.description,
        components: req.body.components,
        styles: req.body.styles,
        updatedAt: new Date()
    };
    
    try {
        await client.connect();
        const db = client.db("app-builder-db");
        const result = await db.collection('projects').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Project updated successfully'
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating project'
        });
    } finally {
        await client.close();
    }
});

// DELETE project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("app-builder-db");
        const result = await db.collection('projects').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting project'
        });
    } finally {
        await client.close();
    }
});

// POST generate code from project
app.post("/api/generate-code/:id", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("app-builder-db");
        const project = await db.collection('projects').findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        
        // Generate HTML, CSS, and JS code
        const generatedCode = generateCode(project);
        
        res.json({
            success: true,
            code: generatedCode
        });
    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating code'
        });
    } finally {
        await client.close();
    }
});

// Code generation helper function
function generateCode(project) {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += `    <title>${project.name}</title>\n`;
    html += '    <style>\n';
    
    // Generate CSS
    let css = '        * { margin: 0; padding: 0; box-sizing: border-box; }\n';
    css += '        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\n';
    
    // Add component styles
    if (project.components && project.components.length > 0) {
        project.components.forEach((component, index) => {
            css += `        #component-${index} {\n`;
            if (component.styles) {
                Object.entries(component.styles).forEach(([key, value]) => {
                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    css += `            ${cssKey}: ${value};\n`;
                });
            }
            css += '        }\n';
        });
    }
    
    html += css;
    html += '    </style>\n';
    html += '</head>\n<body>\n';
    
    // Generate HTML body
    if (project.components && project.components.length > 0) {
        project.components.forEach((component, index) => {
            html += generateComponentHTML(component, index);
        });
    }
    
    html += '</body>\n</html>';
    
    return {
        html: html,
        css: css,
        js: ''
    };
}

function generateComponentHTML(component, index) {
    let html = '';
    const id = `component-${index}`;
    
    switch (component.type) {
        case 'heading':
            html += `    <h${component.level || 1} id="${id}">${component.text || 'Heading'}</h${component.level || 1}>\n`;
            break;
        case 'text':
            html += `    <p id="${id}">${component.text || 'Text content'}</p>\n`;
            break;
        case 'button':
            html += `    <button id="${id}">${component.text || 'Button'}</button>\n`;
            break;
        case 'input':
            html += `    <input type="${component.inputType || 'text'}" id="${id}" placeholder="${component.placeholder || ''}">\n`;
            break;
        case 'image':
            html += `    <img id="${id}" src="${component.src || 'https://via.placeholder.com/300'}" alt="${component.alt || 'Image'}">\n`;
            break;
        case 'container':
            html += `    <div id="${id}">\n`;
            if (component.children && component.children.length > 0) {
                component.children.forEach((child, childIndex) => {
                    html += generateComponentHTML(child, `${index}-${childIndex}`);
                });
            }
            html += `    </div>\n`;
            break;
        default:
            html += `    <div id="${id}">${component.text || ''}</div>\n`;
    }
    
    return html;
}

app.listen(PORT, () => {
    console.log(`🚀 App Builder Server running on port ${PORT}`);
    console.log(`📱 Visit http://localhost:${PORT} to start building apps`);
});
