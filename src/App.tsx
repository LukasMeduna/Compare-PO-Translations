import React from "react";
import { useState } from "react";
import Translation from "./Translation";
import CompareTranslations from "./CompareTranslations";
import "./styles.css";

export default function App() {
  const [firstFile, setFirstFile] = useState<string>();
  const [secondFile, setSecondFile] = useState<string>();

  const firstFileArray = firstFile ? Translation.readPoFile(firstFile) : [];
  const secondFileArray = secondFile ? Translation.readPoFile(secondFile) : [];

  const differentTranslations = Translation.compareTranslations(
    firstFileArray,
    secondFileArray
  );

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const readFile = new FileReader();
      readFile.readAsText(file, "UTF-8");
      readFile.onload = (readerEvent: ProgressEvent<FileReader>) => {
        try {
          if (readerEvent?.target?.result) {
            const data = readerEvent.target.result as string;
            if (data.length > 550000) {
              throw new Error("Too long file (test)");
            }
            if (e.target.id === "firstFileInput") setFirstFile(data);
            if (e.target.id === "secondFileInput") setSecondFile(data);
          } else {
            throw new Error("Error reading file...");
          }
        } catch (error) {
          (document.getElementById(e.target.id) as HTMLInputElement).value = "";
          alert(error);
        }
      };
    }
  };

  return (
    <div className="App">
      <h1>Compare POE Translations</h1>
      <div className="compare-table">
        <div>
          <input type="file" id="firstFileInput" onChange={uploadFile} />
        </div>
        <div>
          <input type="file" id="secondFileInput" onChange={uploadFile} />
        </div>
        {firstFileArray.length > 0 && secondFileArray.length > 0 && (
          <CompareTranslations translations={differentTranslations} />
        )}
      </div>
    </div>
  );
}
