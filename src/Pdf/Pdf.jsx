import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { useEffect, useState } from "react";
import './pdfStyles.css'
import imagem from '../img.png'


export default function Pdf({ data }) {

  const [load, setLoad] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const [base64ImgLocal , setbase64ImgLocal ] = useState('');
  


  
  async function getBase64(img) {
    const imgUrl = await fetch(img);
    const blobImg = await imgUrl.blob()
    const result = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blobImg)
    })
    setbase64ImgLocal(result);
 }




  //Definição do documento pdf
  const doc = {
   
    content: [
      {
        text: data.titulo,
        style: 'header'
      },  
      '\n', //Quebra de linha 
      {
        text: data.subTitulo,
        style: 'subheader'
      },
      '\n', //Quebra de linha 
      data.texto,
      '\n', //Quebra de linha 
      {
        stack: [
          'Titulo da lista',
          {
            ul: [
              'item 1',
              'item 2',
              'item 3',
            ]
          }
        ]
      },
      {
        table: {
          body: [
            ['Lista dentro da tabela', 'Tabela dentro da tabela'],[
              {
                stack: [
                  'Titulo da lista',
                  {
                    ul: [
                      'item 1',
                      'item 2',
                      'item 3',
                    ]
                  }
                ]
              }
            ,
              {
                table: {
                  body: [
                    ['Col1', 'Col2', 'Col3'],
                    ['1', '2', '3'],
                    ['1', '2', '3']
                  ]
                }
              } 
            ]
          ]
        },
      },
      '\n',
      {
        table: {
          body: [['Tabela de apenas uma linha!']]
        }
      },
      '\n',
      {
        table: {
          body: [[
            'Imagen base 64',
            'Imagen png no diretório'
          ], [{
            image: data.img,
            width: 150
          },
           base64ImgLocal ? {
            image: base64ImgLocal,
            width: 150
          }: '-']]
        }
      }
    ],

    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: 'center'
      },
      subheader: {
        fontSize: 15,
        bold: true
      },
      quote: {
        italics: true
      },
      small: {
        fontSize: 8
      }
    }
  }


  
  async function loadPdf() {
    setLoad(true)
    await getBase64(imagem);
    const pdf = pdfMake.createPdf(doc);
    pdf.getDataUrl((url) => {
      setDataUrl(url);
    });
    setLoad(false)
  }

  useEffect(() => {
    loadPdf();
  },[base64ImgLocal]);
  
    

  return(
    <div>
      {
        load ? (<h1>Carregando</h1>) : (
          <iframe className="iframePdf" src={dataUrl}/>
        )
      }      
    </div>
  );
 }
