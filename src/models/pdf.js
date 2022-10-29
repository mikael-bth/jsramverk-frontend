import jsPdf from 'jspdf';

const pdf = {
    savePDF: async function savePDF(editor, docName) {
        const document = editor.editor.getDocument();
        const documentText = document.toString();
        console.log(documentText);
        const pdf = new jsPdf();
        pdf.text(documentText, 10, 10);
        pdf.setFontSize(16);
        pdf.save(docName + '.pdf')
    },
};

export default pdf;