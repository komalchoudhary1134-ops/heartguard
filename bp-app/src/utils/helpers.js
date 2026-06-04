export const getBPStatus = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return 'Normal';
    if (systolic >= 120 && systolic <= 129 && diastolic < 80) return 'Elevated';
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return 'High Stage 1';
    if (systolic >= 140 || diastolic >= 90) return 'High Stage 2';
    return 'Normal';
};

export const getAverageBP = (readings) => {
    if (!readings || readings.length === 0) return { avgSys: 0, avgDia: 0 };
    const avgSys = readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length;
    const avgDia = readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length;
    return { avgSys: Math.round(avgSys), avgDia: Math.round(avgDia) };
};

export const getLatestReading = (readings) => {
    if (!readings || readings.length === 0) return null;
    return readings[0];
};