import { COLOMBIAN_HOLIDAYS } from "@/constants/holidays";
import { Holiday } from "@/types/holiday";

function isHoliday(date: Date, holidays: Holiday[]): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(holiday => {
        const holidayDate = new Date(holiday.date);
        const holidayDateStr = holidayDate.toISOString().split('T')[0];
        return holidayDateStr === dateStr;
    });
}

function isBusinessDay(date: Date, holidays: Holiday[]): boolean {
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
    return isWeekday && !isHoliday(date, holidays);
}

export function calculateBusinessDaysExceeded(createdAt: Date, daysThreshold = 15): number {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    let businessDaysCount = 0;
    let exceededDays = 0;

    createdDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const tempDate = new Date(createdDate);

    while (businessDaysCount < daysThreshold && tempDate <= currentDate) {
        if (isBusinessDay(tempDate, COLOMBIAN_HOLIDAYS)) {
            businessDaysCount++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }

    if (businessDaysCount < daysThreshold) return 0;

    while (tempDate <= currentDate) {
        if (isBusinessDay(tempDate, COLOMBIAN_HOLIDAYS)) {
            exceededDays++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }

    return exceededDays;
}