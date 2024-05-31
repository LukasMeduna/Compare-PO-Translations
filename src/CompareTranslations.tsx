import React from "react";
import Translation from "./Translation";

function TranslationCard(props: { translation: Translation }) {
  return (
    <div className="translation-card">
      <i>{props.translation.id}</i>
      <br />
      ↓
      <br />
      {props.translation.plural ? (
        <div>msgid_plural: {props.translation.plural}</div>
      ) : (
        ""
      )}
      {props.translation.msgstrs.map((msgstr) => (
        <span className="translation-card--msgstr">{msgstr} </span>
      ))}
    </div>
  );
}

export default function CompareTranslations(props: {
  translations: (Translation | null)[][];
}) {
  if (props.translations.length === 0) return null;

  return (
    <>
      {props.translations.map((translation) => (
        <>
          <div>
            {translation[0] ? (
              <TranslationCard translation={translation[0]} />
            ) : (
              "∅"
            )}
          </div>
          <div>
            {translation[1] ? (
              <TranslationCard translation={translation[1]} />
            ) : (
              "∅"
            )}
          </div>
        </>
      ))}
    </>
  );
}
