class DateFormattingService {
    formatDates(data: any) {
        if (!data || !data.docs || !Array.isArray(data.docs)) {
            return data;
        }

        data.docs.forEach((doc: any) => {
            doc.createdAt = DateFormattingService.formatDate(
                new Date(doc.createdAt),
            );
            doc.updatedAt = DateFormattingService.formatDate(
                new Date(doc.updatedAt),
            );
        });

        return data;
    }

    static formatDate(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
}

export const DateFormatting = new DateFormattingService();
