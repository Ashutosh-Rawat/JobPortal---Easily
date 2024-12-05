import fs from 'fs/promises'

export const readData = async (filePath) => {
    try {
        let data = await fs.readFile(
            filePath, { encoding: 'utf-8' }
        )
        return JSON.parse(data)
    } catch (err) {
        console.log('readFile err', err)
        return []
    }
}

export const writeData = async (filePath,data) => {
    try {
        await fs.writeFile(
            filePath, JSON.stringify(data, null, 2), 
            { encoding: 'utf-8' }
        )
    } catch (err) {
        console.log('writeFile err', err)
    }
}
