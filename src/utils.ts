/**
 *  
classNames({
    red: false,
}, 'red', ['size'])
 **/ 
export const classNames = (...clazz : any) => {
    return clazz.reduce((all: string[], clz: any) => {
        if(typeof clz === 'string'){
            all.push(clz)
            return 
        }
        if(Array.isArray(clz)){
            return all.concat(clz);
        }

        if(Object.prototype.toString.call(clz) === '[object Object]'){
            return all.concat(Object.keys(clz).filter(key => clz[key]));
        }
        return all;
    }, []).join(' ');
}