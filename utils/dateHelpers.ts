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

export function calculateBusinessDaysExceeded(
  dueDate: Date | string, 
  businessDaysThreshold: number = 15
): number {
  const due = new Date(dueDate);
  const currentDate = new Date();
  
  due.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  let exceededDays = 0;
  const tempDate = new Date(due);
  
  tempDate.setDate(tempDate.getDate() + 1);
  
  while (tempDate <= currentDate) {
    if (isBusinessDay(tempDate, COLOMBIAN_HOLIDAYS)) {
      exceededDays++;
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }
  
  return exceededDays;
}

export function calculateDueDate(createdAt: Date, businessDaysToAdd = 15): Date {
    const dueDate = new Date(createdAt);
    let businessDaysCount = 0;
    
    while (businessDaysCount < businessDaysToAdd) {
        dueDate.setDate(dueDate.getDate() + 1);
        if (isBusinessDay(dueDate, COLOMBIAN_HOLIDAYS)) {
            businessDaysCount++;
        }
    }
    
    return dueDate;
}