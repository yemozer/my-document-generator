import { Document, Paragraph, TextRun, Packer, AlignmentType } from 'docx';
import { error } from '@sveltejs/kit';
import { Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

export async function POST({ request, url }) {
    try {
        const formData = await request.json();
        const documentType = url.searchParams.get('type');
        let doc, filename;

        switch(documentType) {
            case 'arbitration':
                doc = generateArbitrationAgreement(formData);
                filename = 'arabuluculuk_tutanagi.docx';
                break;
            case 'firstSession':
                doc = generateFirstSessionMinutes(formData);
                filename = 'ilk_oturum_tutanagi.docx';
                break;
            case 'application':
                doc = generateApplicationDocument(formData);
                filename = 'basvuru_tutanagi.docx';
                break;
            case 'agreement':
                doc = generateAgreementDocument(formData);
                filename = 'anlasma_tutanagi.docx';
                break;
            default:
                throw error(400, 'Invalid document type');
        }

        const buffer = await Packer.toBuffer(doc);

        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    } catch (err) {
        console.error('Error in POST handler:', err);
        throw error(500, 'Internal server error');
    }
}


function generateArbitrationAgreement(formData) {
  // Define a base style for the document
  const baseStyle = {
    font: "Calibri",
    size: 24, // 12pt in half-points
    italics: true
  };
  const baseStyle1 = { font: "Calibri", size: 24, italics: true };


  const children = [
    new Paragraph({
      children: [new TextRun({ text: "SON TUTANAK", ...baseStyle, bold: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `ARABULUCULUK DOSYA No:2024/${formData.dosya_numarasi}`, ...baseStyle, bold: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: "ARABULUCU  :", ...baseStyle, bold: true, underline: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: "ADI SOYADI  : Mehmet Celal Kemik", ...baseStyle, bold: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: "SİCİL NO        : 4573", ...baseStyle, bold: true })],
    }),
    new Paragraph({
      children: [new TextRun({ text: "ADRESİ          :", ...baseStyle, bold: true }),
                 new TextRun({ text: " Kemerköprü mah. Kavaf sok. No:2 Bartın", ...baseStyle }),
      ],
    }),
    new Paragraph({
        children: [
            new TextRun({ 
                text: "TARAF 1        :", 
                bold: true,
                underline: true,
                ...baseStyle1 
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
            new TextRun({ text: formData.taraf1isim, ...baseStyle1 }),
            new TextRun({ text: " -TC KİMLİK NO: ", bold: true, ...baseStyle1 }),
            new TextRun({ text: formData.kimlik_no, ...baseStyle1 })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
            new TextRun({ text: formData.taraf1adres, ...baseStyle1 })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({ 
                text: "TARAF 2        :", 
                bold: true,
                underline: true,
                ...baseStyle1
            })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
            new TextRun({ text: formData.taraf2isim, ...baseStyle1 })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({ text: "MERSİS NO   : ", bold: true, ...baseStyle1 }),
            new TextRun({ text: formData.taraf2mersis_no, ...baseStyle1 })
        ]
    }),

    new Paragraph({
        children: [
            new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
            new TextRun({ text: formData.taraf2adres, ...baseStyle1 })
        ]
    }),
    new Paragraph({
      children: [new TextRun({ text: "ARABULUCULUK KONUSU UYUŞMAZLIK: ", ...baseStyle, bold: true, underline: true }),
                 new TextRun({ text: "Kıdem tazminatı, İhbar tazminatları ,Ücret alacağı, Fazla mesai alacağı, yıllık izin alacağı, UGBT alacağı, agi alacağı, hafta sonu çalışma", ...baseStyle }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: `ARABULUCULUK SÜRECİ BAŞLAGIÇ TARİH: `, ...baseStyle, bold: true, underline: true }),
                 new TextRun({ text: `${formData.today}`, ...baseStyle }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: `ARABULUCULUK SÜRECİNİN BİTTİĞİ TARİH: `, ...baseStyle, bold: true, underline: true }),
                 new TextRun({ text: `${formData.today}`, ...baseStyle }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "ARABULUCULUK SONUCU  : ", ...baseStyle, bold: true, underline: true }),
                 new TextRun({ text: "Anlaşma olmuştur. (İhtiyari arabuluculuk)", ...baseStyle }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: `Taraflar, ihtiyari arabuluculuk için tarafımıza birlikte başvurmuş olmakla, arabuluculuk süreci başlatıldı.Adı geçen taraflar ile, online ve yüzyüze oturumlar yapıldı. Taraflara arabuluculuk süreci konusunda bilgi verildi.Anlaşma ve anlaşmama belgesinin, hukuki ve mali yönlerden bütün sonuçları anlatıldı.Taraflar, arabuluculuk sürecinin hukuki ve mali sonuçlarını anladık dediler.Taraflar üzerinde anlaşılan hususlarda dava açılamayacağını anladıklarını kabul ve beyan ettiler. Taraf ${formData.taraf1isim}'a, `, ...baseStyle }),
                 new TextRun({ text: `haklarına ilişkin bir hukukçu uzmandan bilgi alabileceğine dair bilgi verilmiş, `, ...baseStyle, bold: true }),
                 new TextRun({ text: `${formData.taraf1isim} , hakları konusunda bilgi sahibi olduğunu, bu konuda bir uzman görüşü almak istemediklerini beyan etmiş ve müzakerelere başlanmıştır. Taraflar arabulucu huzurunda işçi ve işveren ilişkisine dayalı hizmet akdinden kaynaklı işçilik alacakları, işe iade talebi, boşta geçen süre ücreti, kıdem tazminatı, ihbar tazminatı, yıllık izin ücret, fazla mesai ücreti, ulusal bayram ve genel tatil ücreti, ücret, AGİ, hafta tatili, ikramiye alacağı, yol harcırahı, prim ve maddi ve manevi tazminat alacaklarına ilişkin hususlarda müzakerede bulunmuş ve aralarındaki uyuşmazlığın çözümü konusunda özgür iradeleriyle aşağıdaki şartlarda anlaşmışlar ve 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu'nun 18. maddesi uyarınca anlaşmışlardır.`, ...baseStyle }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: `İş bu son tutanak belgesi, 1 sayfa ve 3 nüsha olarak 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanununun 18.md ve 4857 Sayılı İş Kanununun 21. Maddesi uyarınca hep birlikte imza altına alındı.${formData.today}`, ...baseStyle })],
    }),
    new Paragraph({
        children: [
            new TextRun({ 
                text: "İMZALAR",
                bold: true,
                underline: true,
                italics: true,
                ...baseStyle 
            })
        ],
        indent: {
            left: 5760
        },
    }),
    new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing

    new Paragraph({
      children: [new TextRun({ text: `TARAF 1   : `, ...baseStyle, bold: true }),
                 new TextRun({ text: `${formData.taraf1isim}`, ...baseStyle }),
      ],
    }),
    new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing
    new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing


    new Paragraph({
      children: [new TextRun({ text: `TARAF 2   : `, ...baseStyle, bold: true }),
                 new TextRun({ text: `${formData.taraf2isim}`, ...baseStyle }),
      ],
    }),
    new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing
    new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing


    new Paragraph({
      children: [new TextRun({ text: "ARABULUCU:Uzm.Arb.Av.Mehmet Celal Kemik", ...baseStyle, bold: true })],
    }),
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }],
    styles: {
      paragraphStyles: [
        {
          id: "normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Calibri",
            size: 24,
          },
        },
      ],
    },
  });

  return doc;
}
function generateFirstSessionMinutes(formData) {
    const baseStyle = { font: "Calibri", size: 24 };
    const baseStyle1 = { font: "Calibri", size: 24, italics: true};

    
    const children = [
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "İLK OTURUM AÇILIŞ VE BİLGİLENDİRME TUTANAĞI",
                    ...baseStyle,
                    bold: true
                })
            ],
            alignment: AlignmentType.CENTER
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 1        :", 
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf1isim, ...baseStyle1 }),
                new TextRun({ text: " -TC KİMLİK NO: ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.kimlik_no, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf1adres, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 2        :", 
                    bold: true,
                    underline: true,
                    ...baseStyle1
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2isim, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "MERSİS NO   : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2mersis_no, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2adres, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK KONUSU UYUŞMAZLIK : ", 
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ 
                    text: "İhbar tazminatı, kıdem tazminatı, yıllık izin, fazla mesai, UBGT alacağı, hafta tatili alacağı, AGİ alacağı, diğer işçi alacakları.",
                    ...baseStyle1 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK SÜRECİ BAŞLAGIÇ TARİH : ",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ text: formData.today, ...baseStyle1 })
            ]
        }),
        new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ 
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({ 
                                            text: "İlk Oturum/Açılış Tutanağının Düzenlendiği Yer : ",
                                            bold: true,
                                            underline: true,
                                            ...baseStyle 
                                        }),
                                        new TextRun({ text: "Kemik Arabuluculuk ve Hukuk Bürosu", ...baseStyle })
                                    ]
                                }),
                        
                                new Paragraph({
                                    children: [
                                        new TextRun({ 
                                            text: "İlk Oturum/Açılış Tutanağının Düzenlendiği Tarih : ",
                                            bold: true,
                                            underline: true,
                                            ...baseStyle 
                                        }),
                                        new TextRun({ text: formData.today, ...baseStyle })
                                    ]
                                }),
                        
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Adı geçen taraflar, toplantı odasına geldiler.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                        
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Taraflara arabuluculuğun temel ilkeleri olan, arabuluculuk sürecinin iradi olduğu; arabuluculuk sürecinde her iki tarafın da eşit haklara sahip olduğu; taraflarca aksi kararlaştırılmadıkça arabulucunun arabuluculuk faaliyeti çerçevesinde kendisine sunulan veya diğer bir şekilde elde ettiği bilgi ve belgeler ile diğer kayıtları gizli tutmakla yükümlü olduğu ve tarafların ve görüşmelere katılan diğer kişilerin de bu konudaki gizliliğe uymak zorunda olduğu; tarafların, arabulucunun veya arabuluculuğa katılanlar da dâhil üçüncü bir kişinin, uyuşmazlıkla ilgili hukuk davası açıldığında yahut tahkim yoluna başvurulduğunda, tarafların arabuluculuk sürecine katılma isteğini, arabuluculuk sürecinde taraflarca ileri sürülen görüşleri, önerileri ya da herhangi bir vakıanın veya iddianın kabulünü ve sadece arabuluculuk faaliyeti dolayısıyla hazırlanan belgeleri delil olarak ileri süremeyeceği ve bunlar hakkında tanıklık yapamayacağı hususları hakkında bilgi verildi.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Taraflara arabuluculuk faaliyeti sonunda anlaşmaları hâlinde, arabuluculuk ücretinin, Arabuluculuk Asgari Ücret Tarifesinin eki Arabuluculuk Ücret Tarifesinin İkinci Kısmına göre aksi kararlaştırılmadıkça taraflarca eşit şekilde karşılanacağı, bu durumda ücretin Tarifenin Birinci Kısmında belirlenen iki saatlik ücret tutarından az olamayacağı; arabuluculuk faaliyeti sonunda iki saatten az süren görüşmeler sonunda tarafların anlaşamamaları hâllerinde iki saatlik ücret tutarının Tarifenin Birinci Kısmına göre Adalet Bakanlığı bütçesinden ödeneceği, iki saatten fazla süren görüşmeler sonunda tarafların anlaşamamaları hâlinde ise iki saati aşan kısma ilişkin ücretin aksi kararlaştırılmadıkça taraflarca eşit şekilde uyuşmazlığın konusu dikkate alınarak Tarifenin Birinci Kısmına göre karşılanacağı, Adalet Bakanlığı bütçesinden ödenen ve taraflarca karşılanan arabuluculuk ücretinin yargılama giderlerinden sayılacağı hususları hakkında bilgi verildi.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Taraflara arabulucunun görevini özenle, tarafsız bir biçimde ve şahsen yerine getireceği, arabulucunun taraflar arasında eşitliği gözetmekle yükümlü olduğu, arabuluculuk müzakerelerine tarafların bizzat, kanuni temsilcileri veya vekâletnamesinde özel yetki bulunan avukatları aracılığıyla katılabileceği, arabuluculuk sürecinde arabulucunun rolünün, hâkim veya hakem olmadığı, kimin haklı ya da haksız olduğu konusunda karar vermeyeceği, yargısal bir yetkinin kullanımı olarak sadece hâkim tarafından yapılabilecek işlemleri yapamayacağı, taraflara hukuki tavsiyelerde bulunamayacağı, tarafların çözüm üretemediklerinin ortaya çıkması hâlinde arabulucunun bir çözüm önerisinde bulunabileceği, bununla birlikte bir çözüm önerisi ya da öneriler kataloğu geliştirip bunu taraflara empoze edemeyeceği, müzakereler sırasında geliştirilen bir çözüm önerisi üzerinde anlaşmaya varmaları için tarafları zorlayamayacağı; bununla birlikte, yaşanılan uyuşmazlık ile ilgili çözüm seçeneklerini üreterek bir anlaşmaya ulaşabilmelerinde taraflara yardımcı olacak iletişimin ortamını sağlayacağı, bilgileri dâhilinde ve onay vermeleri hâlinde taraflarla ayrı ayrı veya birlikte görüşebileceği ve iletişim kurabileceği, arabulucu olarak tarafsız bir konumda olduğu, arabuluculuk sürecinin sonunda her iki tarafın da kabul edeceği bir anlaşmaya varılamaması hâlinde açılabilecek olası bir davada, daha sonra avukat olarak görev üstlenemeyeceği, arabuluculuk bürosuna başvurulmasından son tutanağın düzenlendiği tarihe kadar geçen sürede zamanaşımının duracağı ve hak düşürücü sürenin işlemeyeceği, arabuluculuk sürecinin sonunda her iki tarafın da kabul edeceği bir anlaşmaya varılamaması hâlinde yargı organlarına başvuru haklarının bulunduğu hususları hakkında bilgi verildi.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Taraflara arabuluculuk sürecinde düzenlenecek oturum tutanaklarına ve sürecin sonunda düzenlenecek son tutanağa, oturumların ve faaliyetin sonuçlanması dışında hangi hususların yazılacağına tarafların karar vereceği, aynı şekilde arabuluculuk sürecinin sonunda varılan anlaşmanın kapsamının taraflarca belirleneceği, anlaşma belgesi düzenlenmesi hâlinde bu belgenin taraflar veya avukatları ve arabulucu tarafından imzalanacağı, tarafların bu anlaşma belgesinin icra edilebilirliğine ilişkin mahkemeden şerh verilmesini talep edebileceği ve bu şerhi içeren anlaşmanın ilâm niteliğinde belge sayılacağı, taraflar ve avukatları ile arabulucunun birlikte imzaladıkları anlaşma belgesinin icra edilebilirlik şerhi aranmaksızın ilâm niteliğinde belge sayılacağı, arabuluculuk faaliyeti sonunda anlaşmaya varılması hâlinde üzerinde anlaşılan hususlar hakkında taraflarca dava açılamayacağı hususları hakkında bilgi verildi.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Ayrıca, taraflara, kendilerinden arabuluculuk sürecinde birbirlerine karşı \"siz\"li hitap şeklini kullanmalarının ve söz verildiği zaman, sırayla ve sözleri kesilmeden konuşmalarının beklendiği, birbirlerinin sözünü kesmelerinin, söz veya hareketle diğer tarafı övmelerinin veya tahkir etmelerinin yasak olduğu, daha sonra eklemek istedikleri hususlar hakkında kendilerine konuşma olanağı tanınacağı, arabulucu tarafından da kendilerine sorular sorulabileceği hususları belirtilmiş; arabuluculuk sürecinde olabildiğince açık ve dürüst olunmasının ve işbirliği hâlinde hareket edilmesinin önemi vurgulanmış; arabuluculuk sürecinde belirtilen kurullara uymayı kabul edip etmedikleri kendilerine sorulmuştur.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Taraflar söz alarak arabuluculuğun temel ilkelerini, arabuluculuk sürecini ve arabuluculuk süreci sonunda hazırlanan arabuluculuk son tutanağının ve anlaşma belgesinin hukuki ve mali yönlerden bütün sonuçlarını anladık ve arabuluculuk sürecinde belirtilen kurullara uymayı kabul ediyoruz dediler.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Taraflar müzakerelere başlamışlardır.",
                                            ...baseStyle
                                        })
                                    ],
                                    indent: {
                                        firstLine: 720
                                    }
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({ 
                                            text: "İşbu arabuluculuk ilk oturum/açılış tutanağı dört sayfa ve üç nüsha olarak 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu m. 11, m. 15 ve m. 16 ile İş Kanunu 21.md uyarınca hep birlikte imza altına alındı.",
                                            ...baseStyle
                                        }),
                                        new TextRun({ text: formData.today,})
                                    ],
                                    indent: {
                                        firstLine: 720
                                    },
                                    ...baseStyle 
                                }),
                                
                            ]
                        })
                    ],
                    
                })
            ]
        }),

        // Signature section
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "İMZALAR",
                    bold: true,
                    underline: true,
                    
                    ...baseStyle1 
                })
            ],
            indent: {
                left: 5760
            },
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 1     : ",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ text: formData.taraf1isim, ...baseStyle1 })
            ]
        }),
        
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "         ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "             ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 2     : ",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ text: formData.taraf2isim, ...baseStyle1 }),
            ]
        }),
        
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCU:",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ 
                    text: "Uzm.Arb.Av.Mehmet Celal Kemik",
                    ...baseStyle1 
                })
            ]
        })
    ];

    return new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });
}
function generateApplicationDocument(formData) {
    const baseStyle = { font: "Calibri", size: 24 };
    const baseStyle1 = { font: "Calibri", size: 24, italics: true};

    
    const children = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "ARABULUCULUK BAŞVURU TUTANAĞI",
                    size: 30, 
                    font: "Calibri"
                })
            ],
            alignment: AlignmentType.CENTER,
        }),

        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 1        :", 
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf1isim, ...baseStyle1 }),
                new TextRun({ text: " -TC KİMLİK NO: ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.kimlik_no, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf1adres, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 2        :", 
                    bold: true,
                    underline: true,
                    ...baseStyle1
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2isim, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "MERSİS NO   : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2mersis_no, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2adres, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK KONUSU UYUŞMAZLIK : ", 
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ 
                    text: "İhbar tazminatı, kıdem tazminatı, yıllık izin, fazla mesai, UBGT alacağı, hafta tatili alacağı, AGİ alacağı, diğer işçi alacakları.",
                    ...baseStyle1 
                })
            ]
        }),

        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing

        new Paragraph({
            children: [
                new TextRun({   
                    text: "Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu ve İş Mahkemeleri Kanunu gereğince ihtiyari arabuluculuk hükümleri çerçevesinde uyuşmazlığımızın Arabuluculuk yoluyla çözümü için Arabuluculuğunuza başvuruyoruz.",
                    ...baseStyle
                })
            ],
            indent: {
                firstLine: 720
            },
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "Arabuluculuk sürecinin tarafınızca başlatılmasını talep ederiz.",
                    ...baseStyle 
                }),
                new TextRun({ text: formData.today, ...baseStyle })
            ],
            indent: {
                firstLine: 720
            },
        }),

        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing

 

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 1     : ",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ text: formData.taraf1isim, ...baseStyle1 })
            ]
        }),
        
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "         ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "             ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 2     : ",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ text: formData.taraf2isim, ...baseStyle1 }),
            ]
        }),
        
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCU:",
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                }),
                new TextRun({ 
                    text: "Uzm.Arb.Av.Mehmet Celal Kemik  Sicil No:4573",
                    ...baseStyle1 
                })
            ]
        })
    ];

    return new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });
}

function generateAgreementDocument(formData) {
    const baseStyle = { font: "Calibri", size: 24 };
    const baseStyle1 = { font: "Calibri", size: 24, italics: true};

    
    const children = [
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ANLAŞMA TUTANAĞI (İhtiyari Alabuluculuk)",
                    bold: true,
                    italics: true,
                    ...baseStyle 
                })
            ],
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: `ARABULUCULUK DOSYA No:2024/${formData.dosya_numarasi}`,
                    bold: true,
                    italics: true,
                    ...baseStyle 
                })
            ],
        }),

        new Paragraph({
            children: [new TextRun({ text: "ARABULUCU  :", ...baseStyle, bold: true, underline: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "ADI SOYADI  : Mehmet Celal Kemik", ...baseStyle, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "SİCİL NO        : 4573", ...baseStyle, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: "ADRESİ          :", ...baseStyle, bold: true }),
                       new TextRun({ text: " Kemerköprü mah. Kavaf sok. No:2 Bartın", ...baseStyle }),
            ],
          }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 1        :", 
                    bold: true,
                    underline: true,
                    ...baseStyle1 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf1isim, ...baseStyle1 }),
                new TextRun({ text: " -TC KİMLİK NO: ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.kimlik_no, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf1adres, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 2        :", 
                    bold: true,
                    underline: true,
                    ...baseStyle1
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADI SOYADI  : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2isim, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "MERSİS NO   : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2mersis_no, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ text: "ADRESİ          : ", bold: true, ...baseStyle1 }),
                new TextRun({ text: formData.taraf2adres, ...baseStyle1 })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK KONUSU UYUŞMAZLIK :", 
                    bold: true,
                    italics: true,
                    underline: true,
                    ...baseStyle 
                }),
                new TextRun({ 
                    text: "Kıdem tazminatı, İhbar tazminatları ,Ücret alacağı, Fazla mesai alacağı, yıllık izin alacağı, UGBT alacağı, agi alacağı, hafta sonu çalışma alacağı,",
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK SÜRECİ BAŞLAGIÇ TARİH :",
                    bold: true,
                    italics: true,
                    underline: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.today, italics: true, ...baseStyle })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK SÜRECİNİN BİTTİĞİ TARİH:",
                    bold: true,
                    italics: true,
                    underline: true,
                    ...baseStyle 
                }),
                new TextRun({ text: ` ${formData.today}`, italics: true, ...baseStyle })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCULUK SONUCU :",
                    bold: true,
                    italics: true,
                    underline: true,
                    ...baseStyle 
                }),
                new TextRun({ 
                    text: "Anlaşma olmuştur. (İhtiyari arabuluculuk)",
                    bold: true,
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "Taraflar, ihtiyari arabuluculuk için tarafımıza birlikte başvurmuş olmakla, arabuluculuk süreci başlatıldı.",
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),
        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing


        new Paragraph({
            children: [
                new TextRun({ 
                    text: "Adı geçen taraflar ile, online ve yüzyüze oturumlar yapıldı. Taraflara arabuluculuk süreci konusunda bilgi verildi.Anlaşma ve anlaşmama belgesinin, hukuki ve mali yönlerden bütün sonuçları anlatıldı.Taraflar, arabuluculuk sürecinin hukuki ve mali sonuçlarını anladık dediler.Taraflar üzerinde anlaşılan hususlarda dava açılamayacağını anladıklarını kabul ve beyan ettiler. Taraf ",
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf1isim, italics: true, ...baseStyle }),
                new TextRun({ 
                    text: "'a, haklarına ilişkin bir hukukçu uzmandan bilgi alabileceğine dair bilgi verilmiş, ",
                    italics: true,
                    bold: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf1isim, italics: true, ...baseStyle }),
                new TextRun({ 
                    text: " , hakları konusunda bilgi sahibi olduğunu, bu konuda bir uzman görüşü almak istemediklerini beyan etmiş ve müzakerelere başlanmıştır. Taraflar arabulucu huzurunda işçi ve işveren ilişkisine dayalı hizmet akdinden kaynaklı işçilik alacakları, işe iade talebi, boşta geçen süre ücreti, kıdem tazminatı, ihbar tazminatı, yıllık izin ücret, fazla mesai ücreti, ulusal bayram ve genel tatil ücreti, ücret, AGİ, hafta tatili, ikramiye alacağı, yol harcırahı, prim ve maddi ve manevi tazminat alacaklarına ilişkin hususlarda müzakerede bulunmuş ve aralarındaki uyuşmazlığın çözümü konusunda özgür iradeleriyle aşağıdaki şartlarda anlaşmışlar ve 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu'nun 18. maddesi uyarınca anlaşmaya varmaları üzerine işbu anlaşma belgesi hazırlanmıştır.",
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),
        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing


        new Paragraph({
            children: [
                new TextRun({ 
                    text: "Taraflar, İşçi ",
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf1isim, italics: true, ...baseStyle }),
                new TextRun({ 
                    text: " 'ın, karşı taraf, ",
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf2isim, italics: true, ...baseStyle }),
                new TextRun({ 
                    text: " 'den, Kıdem tazminatı ve diğer işçi alacakları olarak, toplam net 42.257,48 TL alacağı olduğu hususunda mutabık kalmışlardır.",
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),
        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "İş bu, 42.257,48 TL toplam alacak, işveren şirket tarafından, işçinin Bankadaki maaş hesabına yatırılacaktır.",
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "İşçi ",
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf1isim, italics: true, ...baseStyle }),
                new TextRun({ 
                    text: " , yukarıda belirtilen alacak dışında işverenden, İhbar tazminatı, kıdem tazminatı, yıllık izin, fazla mesai, UBGT alacağı, hafta tatili alacağı, AGİ alacağı ikramiye alacağı, yol harcırahı, prim, boşta geçen süre ücreti , bonus ve maddi ve manevi tazminat alacağının var olmadığını, işe iade talebinin olmadığını varsa da feragat ettiğini kabul ve taahhüt eder.",
                    italics: true,
                    ...baseStyle 
                })
            ]
        }),
        new Paragraph({ text: "", ...baseStyle }), // Empty line for spacing


        new Paragraph({
            children: [
                new TextRun({ 
                    text: "İş bu Anlaşma belgesi, 2 sayfa ve 3 nüsha olarak 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanununun 18.md ve 4857 Sayılı İş Kanununun 21. Maddesi uyarınca hep birlikte imza altına alındı.",
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.today, italics: true, ...baseStyle })
            ]
        }),

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "İMZALAR",
                    bold: true,
                    underline: true,
                    italics: true,
                    ...baseStyle 
                })
            ],
            indent: {
                left: 5760
            },
        }),


        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 1     : ",
                    bold: true,
                    underline: true,
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf1isim, italics: true, ...baseStyle })
            ]
        }),
        
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "         ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "             ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "TARAF 2     : ",
                    bold: true,
                    underline: true,
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ text: formData.taraf2isim, italics: true, ...baseStyle }),
            ]
        }),
        
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: "              ",
                    
                    ...baseStyle 
                }),
            ]
        }),
        

        new Paragraph({
            children: [
                new TextRun({ 
                    text: "ARABULUCU:",
                    bold: true,
                    underline: true,
                    italics: true,
                    ...baseStyle 
                }),
                new TextRun({ 
                    text: "Uzm.Arb.Av.Mehmet Celal Kemik  Sicil No:4573",
                    italics: true,
                    ...baseStyle 
                })
            ]
        })
    ];

    return new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });
}