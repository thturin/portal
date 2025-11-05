export const createSession = (labTitle="null",username="null", userId=null, labId=null)=> (
    {
        labTitle,
        username,
        userId, //required in schema
        labId, //required in schema
        lastModified: new Date().toISOString(),
        responses:{},
        gradedResults:{},
        finalScore:{
            totalScore:0,
            maxScore:0,
            percent:0
        }
    }
);


export const updateSession = (currentSession, updates)=>({
    ...currentSession, //copy everything from current session
    ...updates, //overwrite any key:value pair that is updated
    labInfo: { 
        ...currentSession.labInfo, //keep existing lab info
        ...updates.labInfo, // apply lab info updates
        lastModified: new Date().toISOString()
    } 
});