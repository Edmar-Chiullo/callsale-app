import * as XLSX from 'xlsx';

export const loadExcelAsJson = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.xlsx, .xls'
        
        input.onchange = async (event: Event) => {
            const target = event.target as HTMLInputElement
            if (!target.files || target.files.length === 0) return
            
            const file = target.files[0]
            const reader = new FileReader()
            
            reader.onload = (e) => {
                const data = e.target?.result
                if (!data) return reject(new Error('Erro ao ler o arquivo'))
                
                const workbook = XLSX.read(data, { type: 'binary' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(sheet)
                
                resolve(jsonData)
            }
            
            reader.onerror = () => reject(new Error('Erro ao carregar o arquivo'))
            reader.readAsArrayBuffer(file)
        };
        
        input.click()
    });
};
