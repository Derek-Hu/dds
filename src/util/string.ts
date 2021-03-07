export const toCamelCase = (val?: string) => {
    if(val===null || val === undefined){
        return '';
    }
    return val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase();
}