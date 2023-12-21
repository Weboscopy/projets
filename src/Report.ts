import { Analyzer, Printer } from "./types";


export class Report {
    constructor(public analyzer : Analyzer, public printer : Printer){}

    generate(): void {
        const analysis = this.analyzer.run()
        this.printer.print(analysis)
    }
}