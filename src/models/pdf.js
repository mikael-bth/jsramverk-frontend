import jsPdf from 'jspdf';

const pdf = {
    savePDF: function savePDF(editor, docName) {
        const document = editor.editor.getDocument();
        const documentText = document.toString();
        const pdf = new jsPdf({
            format: 'a2'
        });
        pdf.text(documentText, 5, 10);
        pdf.setFontSize(16);
        pdf.save(`${docName}.pdf`);
    },
};

export default pdf;