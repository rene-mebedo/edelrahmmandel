import { OpinionPdfs } from '../../imports/api/collections/opinion-pdfs';
import fs_extra from 'fs-extra';
import moment from 'moment';

// MT 08.12.2022
// Diese Funktion wurde im Produktvsystem einmal ausgeführt und wird deshalb nicht mehr benötigt.
return;

console.log( 'start archive and dearchive all opinionPDFs' );

// Einmalig jedes opinionPDF archivieren und dearchivieren, damit alle PDFs im Unterordner des Jahres abgelegt werden.
// Vor Version 1.1.0 wurden alle PDF Dateien ohne Unterordner abgelegt, das wird mit dieser Routine einmalige bereinigt.

const opinionPdfs = OpinionPdfs.find();
opinionPdfs.forEach( opinionPdf => {
    /*
    Archivieren:
    1. Datei auf Speicher/FS verschieben.
    2. Pfade in Collection anpassen.
        Zur Sicherheit werden folgende Eigenschaften aktualisiert:
        - path (Pfad inkl. Dateiname)
        - _storagePath (nur Pfad!)
        - versions.original.path (Pfad inkl. Dateiname)
    3. meta.archive auf true setzen.
    */
    // Aktuellen Dateipfad auslesen.
    let src = opinionPdf.versions.original.path;
    let settings = JSON.parse( process.env.MGP_SETTINGS );
    let archivePath = `${settings.PdfArchivePath}/${moment(opinionPdf.meta.createdAt).format('YYYY')}`;
    // Zielpfad = archivePath inkl. [Jahr der Erstellung des PDFs] + _id.pdf
    let dest = `${archivePath}/${opinionPdf._id}.pdf`;

    // Datei auf Speicher/FS verschieben
    fs_extra.move( src , dest )
    .then(() => {
        console.log( `1. Archive: File move successfull to ${dest}` );
        // Pfade in Collection anpassen und meta.archive auf true setzen.
        OpinionPdfs.update({ _id: opinionPdf._id , 'meta.refOpinion': opinionPdf.meta.refOpinion }, {
            $set: {
                'meta.archive': true,
                'path': dest,
                '_storagePath': archivePath,
                'versions.original.path': dest
            }
        });
        src = dest;
        //settings = JSON.parse( process.env.MGP_SETTINGS );
        origPath = `${settings.PdfPath}/${moment(opinionPdf.meta.createdAt).format('YYYY')}`;
        dest = `${origPath}/${opinionPdf._id}.pdf`;
        // Datei auf Speicher/FS verschieben
        fs_extra.move( src , dest )
        .then(() => {
            console.log( `2. Dearchive: File move successfull to ${dest}` );
            // Pfade in Collection anpassen und meta.archive auf false setzen.
            OpinionPdfs.update({ _id: opinionPdf._id , 'meta.refOpinion': opinionPdf.meta.refOpinion }, {
                $set: {
                    'meta.archive': false,
                    'path': dest,
                    '_storagePath': origPath,
                    'versions.original.path': dest
                }
            });
        })
        .catch( err2 => {
            console.error( err2 )
    })
    })
    .catch( err => {
        console.error( err )
    })

    /*
    Dearchivieren:
    1. Datei auf Speicher/FS verschieben.
    2. Pfade in Collection anpassen.
        Zur Sicherheit werden folgende Eigenschaften aktualisiert:
        - path (Pfad inkl. Dateiname)
        - _storagePath (nur Pfad!)
        - versions.original.path (Pfad inkl. Dateiname)
    3. meta.archive auf false setzen.
    */
    // Aktuellen Dateipfad im Archiv auslesen.
    //src = opinionPdf.versions.original.path;
    /*src = dest;
    //settings = JSON.parse( process.env.MGP_SETTINGS );
    origPath = `${settings.PdfPath}/${moment(opinionPdf.meta.createdAt).format('YYYY')}`;
    dest = `${origPath}/${opinionPdf._id}.pdf`;

    // Datei auf Speicher/FS verschieben
    fs_extra.move( src , dest )
    .then(() => {
        console.log( `2. Dearchive: File move successfull to ${dest}` );
        // Pfade in Collection anpassen und meta.archive auf false setzen.
        OpinionPdfs.update({ _id: opinionPdf._id , 'meta.refOpinion': opinionPdf.meta.refOpinion }, {
            $set: {
                'meta.archive': false,
                'path': dest,
                '_storagePath': origPath,
                'versions.original.path': dest
            }
        });
    })
    .catch( err => {
        console.error( err )
    })*/
});

console.log( 'done archive and dearchive all opinionPDFs' );