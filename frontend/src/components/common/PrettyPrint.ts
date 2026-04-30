

export const PrettyPrint = ({rawText, unit} : {rawText: string | number, unit?: string}) => {
    let prettyString = String(rawText);
    prettyString = prettyString.charAt(0).toUpperCase() + prettyString.slice(1);

    prettyString = prettyString.replaceAll('_', ' ');

    let foundSpaceIndex = prettyString.indexOf(" ")

    while (foundSpaceIndex !== -1) {
        prettyString = prettyString.slice(0, foundSpaceIndex + 1) 
                    + prettyString.charAt(foundSpaceIndex + 1).toUpperCase() 
                    + prettyString.slice(foundSpaceIndex + 2);

        foundSpaceIndex = prettyString.indexOf(" ", foundSpaceIndex + 1);
    }

    if (unit != undefined) {
        prettyString += unit;
    }
    return prettyString;
}