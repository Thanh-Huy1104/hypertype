export class Buffer {
    private lines: string[] = [];

    public addLine(line: string) {
        this.lines.push(line);
    }

    public getLines(): string[] {
        return this.lines;
    }
}
