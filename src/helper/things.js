import * as svcThing from '../services/svc-thing'

export const getExtKeyThing = async function(id, token){
    try{
        const thing = await svcThing.getThing(id, token)
        if(thing){
            return thing.metadata.external_key
        }
    }catch(e){
        throw new Error(e)
    }
}