export default class Translation {
  id: string;
  plural: string | null;
  msgstrs: string[];
  constructor(id: string, plural: string | null, msgstrs: string[]) {
    this.id = id;
    this.plural = plural;
    this.msgstrs = msgstrs;
  }

  static readPoFile(file: string): Translation[] {
    const lines = file.split("\n");
    let translationsArray = [];
    for (let i = 0; i < lines.length; i++) {
      let msgctxt: string | null = null;
      if (lines[i].startsWith("msgctxt")) {
        msgctxt = lines[i].replace('msgctxt "', "").replace('"', "");
        i++;
      }
      if (lines[i].startsWith("msgid")) {
        let id = lines[i].replace('msgid "', "").replace('"', "");
        if (id === "") {
          while (lines[i + 1].startsWith('"')) {
            i++;
            id += lines[i].replaceAll('"', "");
          }
        }
        if (msgctxt) id += `, context: ${msgctxt}`;

        let plural = null;
        let msgstrs = [];

        while (lines[i + 1] !== "") {
          i++;
          if (!lines[i]) break;
          if (lines[i].startsWith("msgid_plural"))
            plural = lines[i].replace('msgid_plural "', "").replaceAll('"', "");
          if (lines[i].startsWith("msgstr")) {
            let msgstr = lines[i]
              .replace(/msgstr\[(\d+)\]/g, "")
              .replace("msgstr", "")
              .replaceAll('"', "");
            if (msgstr.trim() === "") {
              while (lines[i + 1].startsWith('"')) {
                i++;
                msgstr += lines[i].replaceAll('"', "");
              }
            }
            msgstrs.push(msgstr);
          }
        }
        if (id) translationsArray.push(new Translation(id, plural, msgstrs));
      }
    }
    return translationsArray;
  }

  static compareTranslations(
    firstTranslations: Translation[],
    secondTranslations: Translation[]
  ) {
    let differentTranslations: (Translation | null)[][] = [];
    for (let firstTranslation of firstTranslations) {
      let secondTranslation = secondTranslations.find(
        (translation) => translation.id === firstTranslation.id
      );
      if (!secondTranslation) {
        differentTranslations.push([firstTranslation, null]);
        continue;
      }
      secondTranslations.splice(
        secondTranslations.indexOf(secondTranslation),
        1
      );
      if (firstTranslation.plural !== secondTranslation.plural) {
        differentTranslations.push([firstTranslation, secondTranslation]);
        continue;
      }
      if (
        firstTranslation.msgstrs.length !== secondTranslation.msgstrs.length
      ) {
        differentTranslations.push([firstTranslation, secondTranslation]);
        continue;
      }
      for (let i = 0; i < firstTranslation.msgstrs.length; i++) {
        if (firstTranslation.msgstrs[i] !== secondTranslation.msgstrs[i]) {
          differentTranslations.push([firstTranslation, secondTranslation]);
          break;
        }
      }
    }
    for (let secondTranslation of secondTranslations) {
      differentTranslations.push([null, secondTranslation]);
    }
    return differentTranslations;
  }
}
