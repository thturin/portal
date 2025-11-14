import axios from "axios";


export async function loadLab(apiHost, assignmentId, title = "Untitled"){
    const url = `${apiHost}/lab/load-lab`;
    const response = await axios.get(url,{
        params:{assignmentId:Number(assignmentId,
            title
        )}
    });
    return response.data;
}


//DETEREMINE IF THIS IS EVEN BEING USED 