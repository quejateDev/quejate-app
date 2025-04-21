export function calculateBusinessDaysExceeded(createdAt: Date, daysThreshold = 15): number {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  let businessDaysCount = 0;
  let exceededDays = 0;
  
  const tempDate = new Date(createdDate);

  while (businessDaysCount < daysThreshold && tempDate <= currentDate) {
    tempDate.setDate(tempDate.getDate() + 1);
    if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
      businessDaysCount++;
    }
  }

  if (businessDaysCount < daysThreshold) return 0;

  while (tempDate <= currentDate) {
    if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
      exceededDays++;
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return exceededDays;
}