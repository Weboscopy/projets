

export function convertStringToDate(strDate: string): Date {
    const dateParts = strDate
                         .split("/")
                          .map((part: string): number => Number(part))

    
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
}