export abstract class CSVReader <T> {
    data : T[] = []
    constructor(public file: File){}

    private load(file: File): Promise<string>{
        return new Promise((resolve, reject) => {
            let stringContent = ""
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = function (e){
               stringContent = e?.target?.result as string
               resolve(stringContent)
            }
            reader.onerror = function(e){
                reject(e?.target?.error?.message)
            }
        })
    }

    async read(): Promise<void>{
      const stringContent =   await this.load(this.file)
      this.data = stringContent
                        .split("\n")
                        .map((row : string) : string[] => row.split(","))
                        .map(this.convertRow)
    }

    abstract convertRow(row: string[]): T 
}