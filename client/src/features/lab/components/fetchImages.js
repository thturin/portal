
export const getImageUrlsFromHtml = (htmlString) =>{
    if(!htmlString) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString,'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach(img=>{
        const src = img.getAttribute('src');
        if( src && src.startsWith('/images/')){
            //console.log(`url ->${process.env.REACT_APP_API_LAB_HOST?.replace('/api','')}${src}`);
            img.setAttribute('src',`${process.env.REACT_APP_API_LAB_HOST?.replace('/api','')+src}`);
        }
    })
   return doc.body.innerHTML;
};

//export default {getImageUrlsFromHtml};