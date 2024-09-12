
import express from 'express'
import path from "path"
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const index = path.join(__dirname, '../../build', 'index.html');
const frontendCallback = (req, res) => {
    res.sendFile(index)
}
const frontendRouter = express.Router()

// frontendRouter.get('/sitemap', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../', 'dinyad_map.xml'))
// })


frontendRouter.get('/', frontendCallback)
frontendRouter.get('/r/:id', frontendCallback)
frontendRouter.get('/*', frontendCallback)

export default frontendRouter