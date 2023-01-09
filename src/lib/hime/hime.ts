import { keyLookUp, getKeymap } from './keylayout'
import {
    isInitialJamo, isMedialJamo, isFinalJamo,
    initialJamoOffset, medialJamoOffset, finalJamoOffset,
    composeJamo, composeSyllable, composeBlock
} from './jamo'

export default {
    keyLookUp,
    key: keyLookUp,
    getKeymap,
    isInitialJamo, isMedialJamo, isFinalJamo,
    initialJamoOffset, medialJamoOffset, finalJamoOffset,
    composeJamo, composeSyllable, composeBlock
}

/* TODO consider group access 
    hime.key...
    hime.jamo...
*/