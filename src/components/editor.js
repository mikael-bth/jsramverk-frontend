import docsModel from '../models/docs';

const [docs, setDocs] = useState([]);
const [currentDoc, setCurrentDoc] = useState({});

useEffect(() => {
    (async () => {
        const allDocs = await docsModel.getAllDocs();
        setDocs(allDocs);
    })();
}, [currentDoc]);

<select
    onChange={fetchDoc}
>
    <option value="-99" key="0">Choose a document</option>
    {docs.map((doc, index) => <option value={index} key={index}>{doc.name}</option>)}
</select>