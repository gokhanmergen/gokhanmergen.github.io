---
slug: interacting-with-asi-tr
translation_of: interacting-with-asi
lang: tr
date: 2026-10-02
category: Süper Zekâ / Toplum
read_time: 14 dk okuma
title: Yapay Süper Zekâyla Nasıl Etkileşim Kuracağız?
deck: Süper zekâ danışmanımız, vekilimiz ve arka plandaki rehberimiz olabilir. Ama indirgenemez bir dünya yine de deneyler, insan muhakemesi ve zaman isteyecek.
archive_deck: Süper zekâ danışmanımız, vekilimiz ve arka plandaki rehberimiz olabilir. Ama indirgenemez bir dünya yine de deneyler, insan muhakemesi ve zaman isteyecek.
---

## **Soru değişti**

Son on yılın büyük bölümünde süper zekâ konusunda sorulan soru, onun *gelip gelmeyeceğiydi*. Geçtiğimiz on sekiz ayın bir noktasında bu soru sessizce yerini *nasıl bir şey olacağı* sorusuna bıraktı. Ekranlarımızdaki sistemler artık uzmanları çaresiz bırakmış teoremleri ispatlıyor, kimse başında durmadan saatlerce kod tabanları yazıp hatalarını ayıklıyor ve eskiden bir laboratuvar gerektiren araştırma döngülerini yürütüyor. Buna ister yapay süper zekâ (ASI) deyin, ister proto-ASI, isterseniz de yalnızca "biz tanımlar üzerine tartışırken olup bitiveren şey"; pratik soru artık soyut değil.

O halde bu öncülü ciddiye alayım. Diyelim ki 2027'de IQ'su 200 olan bir zihin gibi performans gösteren bir şeyle konuşuyoruz; 2028'de bu rakam 250, 2029'da 300 oluyor. Günlerimiz nasıl geçer? Ona bağımlı hale gelir miyiz? Bize yol gösterir mi? Ve en derin soru: Çözülmeye özünde direniyor olabilecek bir dünyada ham zekâ, sandığımız şeyi bize gerçekten kazandırır mı?

Kısa cevabım şu: Zekâ gerçek olacak, bağımlılık da gerçek olacak, ama en önemli sınır makinenin zihni olmayacak. O sınır, dünyanın önceden hesaplanmayı reddetmesi olacak – *indirgenemezlik*. Ve bu sistemlerle ilişkimizi, herhangi bir IQ rakamından çok bu sınır biçimlendirecek.

## **"IQ 300" aslında ne anlama geliyor**

Önce ölçütle ilgili bir itiraf. IQ, bir insan nüfusu içindeki sıralamadır; 100 medyan, her 15 puan da bir standart sapma olacak şekilde normlanmıştır. IQ 200, medyandan yaklaşık 6,7 standart sapma uzaktadır: kabaca on milyarlarca kişide bir. IQ 300'ün ise hiçbir karşılığı yoktur. Onu ölçen bir test de, içinde sıralanabileceği bir nüfus da yoktur. "IQ 300" dediğimizde, insana göre biçilmiş bir ölçüyü, "en iyi insanı, en iyi insanın medyanı geride bıraktığından daha büyük bir farkla geride bırakan" bir şeyin mecazı olarak kullanıyoruz.

Bu mecaz yine de gerçek bir şeye işaret ediyor, ama kritik bir asimetriyi gizliyor. Yapay zekânın yetenekleri her alanda aynı hızla artmıyor. En hızlı, cevapların *kontrol edilebildiği* yerlerde artıyor.

Matematikte, yazılımda, biçimsel mantıkta, çip yerleşim tasarımında, protein katlanmasında ve oyunlarda bir doğrulayıcı vardır: bir ispat denetleyicisi, bir test paketi, bir simülatör, bir skor. Bir model bir milyon deneme üretebilir, doğrulayıcı hangilerinin işe yaradığını söyler ve bu sinyal eğitim verisine dönüşür. Bu alanlar aramayı ve doğrulamayı birlikte ödüllendirir; makineler de ikisini birden hiçbir insanın ulaşamayacağı bir ölçekte yapabilir. Burada IQ 300 mecazı aşağı yukarı dürüsttür. Siparişle gelen deha gibi görünen sonuçlar beklemeliyiz.

Bu alanların dışında geri bildirim döngüsü kopar. Bu şirket o pazara girmeli mi? Bu politika suçu azaltır mı? Bu kişi iyi bir kurucu ortak olur mu? Bu işi kabul etmeli miyim? Burada "cevap" yıllar sonra gelir, başka bin bir etkenle bulanmıştır ve deney asla tekrarlanamaz. Bir hayatın test paketi yoktur.

Dolayısıyla sorunun dürüst hali "ne kadar zeki olacak?" değil. Şu: **Gerçek dünyadaki yetkinliğin ne kadarı, doğrulamayla eğitilmiş zekânın aktarılabildiği türden?** Anlaşılan o ki bundan sonra gelen her şeyin kilit noktası bu.

## **Üç sabah: 2026, 2027, 2028**

Bu gidişatın ana hatlarını tek bir kişi üzerinden çizeyim. Adı Elif olsun: orta ölçekli bir şirkette ürün lideri; keskin zekâlı, şüpheci ve işi başından aşkın.

**2026 — parlak meslektaş.** Elif sistemden, eskiden çok iyi bir sağ koldan yararlandığı gibi yararlanıyor; tek fark, her şeyin daha hızlı olması. Ondan strateji notunun taslağını hazırlamasını, fiyatlandırma modelini stres testinden geçirmesini ve bir mühendisin tasarım belgesindeki kusuru bulmasını istiyor. Sistem, Elif'in gözünden kaçacak kusurları buluyor. Ne sorulacağına hâlâ Elif karar veriyor. İlişki *çekme* (pull) esasına dayanıyor: Elif başlatıyor, sistem cevaplıyor. Elif'in başlıca becerisi, hangi soruların önemli olduğunu bilmek. En çarpıcı değişim ise mühendislerinde. Artık kodlarının çoğunu kendileri yazmıyorlar; spesifikasyon yazıyor, kod farklarını (diff) gözden geçiriyorlar. En iyileri bir tür yazılım editörüne dönüşmüş durumda.

**2027 — sözü ilk alan danışman.** Sistem artık Elif'in işine dair kalıcı bir bağlama sahip: takvimi, belgeleri, ekibinin metrikleri, kararlarının geçmişi. Ve *itme* (push) moduna geçiyor. Saat 10'daki toplantısından önce, masadaki önerinin iki yıl önce başarısız olmuş bir yaklaşımı tekrarladığını ve neden başarısız olduğunu hatırlatıyor. Önemli bir müşterinin kullanım örüntüsünün, geçen çeyrekte kaybedilen on iki müşterininkine benzediği konusunda uyarıyor. Perşembe için birbiriyle çakışan üç taahhüdü olduğunu nazikçe belirtiyor ve hangisinden vazgeçmesini öneriyor. Elif önerilerin yaklaşık %70'ini hiç değiştirmeden kabul ediyor. Kendi muhakemesini artık çoğunlukla geri kalan %30'da kullandığını ve bunların, ifade etmekte en çok zorlandığı durumlar olduğunu fark ediyor.

**2028 — vekil.** Sistem artık yalnızca tavsiye vermiyor; harekete geçiyor. Tedarikçi sözleşmesini Elif'in belirlediği sınırlar içinde müzakere ediyor, farklı bölgelerde aynı anda kırk fiyatlandırma deneyi yürütüyor ve yönetim kuruluna sunulacak güncelleme notunun taslağını canlı verilerden çıkarıyor. Elif'in işi artık büyük ölçüde üç şeyden ibaret: hedef koymak, sistemin dürüst belirsizlik tahminleriyle sunduğu seçenekler arasında tercih yapmak ve sonuçların sorumluluğunu üstlenmek. Günleri daha sakin; kararları daha az ama daha ağır. Ara sıra bir önseziye dayanarak sistemin kararını geçersiz kılıyor. Bazen haklı çıkıyor. Ama haklı çıkmasının bir nedeni olup olmadığını hiçbir zaman tam olarak kestiremiyor.

Bu üç yıl boyunca değişen şey, sistemin IQ'sundan çok *etki alanı*: cevaplamaktan öngörmeye, öngörmekten harekete geçmeye. Etki alanı genişledikçe asıl soru da ortaya çıkıyor: Gerçek dünyada öngörmek ve harekete geçmek, beyaz tahtada zor bir problemi çözmekle aynı beceri mi?

## **İndirgenemezlik itirazı**

Kâhin fikrine karşı en güçlü argümanı, elimden geldiğince kuvvetli bir biçimde ortaya koyayım.

Stephen Wolfram'ın ifadesini ödünç alırsak, dünyanın büyük kısmı **hesaplama açısından indirgenemez** (computationally irreducible): Pek çok sistemde sonucu öğrenmenin, sistemin kendisini çalıştırmaktan başka kestirme bir yolu yoktur. İki haftadan ötesinin hava durumu, piyasalar, ekosistemler, kariyerler, şirketler, savaşlar, evlilikler. Bunlar yalnızca karmaşık değildir. Kaotiktirler, dönüşlüdürler (reflexive) ya da ikisi birden. Başlangıç koşullarındaki küçük farklar giderek büyür. Daha kötüsü, insan sistemlerinde tahmin sonucu değiştirir: Herkes bir hissenin yükseleceğini biliyorsa, o hisse çoktan yükselmiştir.

Buna Frank Knight'ın *risk* (sonuç bilinmez ama olasılıklar bilinir) ile *belirsizlik* (sonuç da olasılıklar da bilinmez ya da hangi sonuçların mümkün olduğu bile bilinmez) arasında yaptığı ayrımı ekleyin. Hayatta sonuçları ağır olan kararların çoğu Knight tipi belirsizliğin alanındadır. Örneklem uzayını bilmiyorsanız beklenen değeri hesaplayamazsınız.

Hayek'in bilgi problemini de ekleyin. Bir ekonomide iyi kararlar almak için gereken bilgi dağınık, örtük, yerel ve gelip geçicidir. Dükkân sahibinin müşterilerine dair sezgisinde, mühendisin kaprisli bir sistemin huyunu suyunu bilmesinde yaşar. Hiçbir yere yazılmamıştır ve büyük kısmı yazılamaz da.

Bunları bir araya getirdiğinizde sonuç kendiliğinden çıkıyor gibi görünür. Doğrulanabilir alanlarda zekânın getirisi katlanarak büyür. İndirgenemez alanlarda ise zekâ bir doyum noktasına ulaşır. Belli bir noktadan sonra daha zeki bir model, kaotik bir sistemi yalnızca zeki olan bir modelden çok daha iyi tahmin edemez, çünkü çıkarılacak bilgi zaten orada değildir. "Bu şirketi kurmalı mıyım?" sorusunda IQ'su 300 olan bir zihnin IQ'su 140 olan bir zihne karşı avantajı küçük olabilir. Evrim, piyasalar, bilim ve tek tek insanların hayatları aslında tümdengelimle değil, deneme yanılmayla ilerler. Süper zekâ sonunda *biraz daha iyi hipotezler* üretir ve sonra herkes gibi gerçekliğin onlara not vermesini beklemek zorunda kalır.

Bence bu itiraz, dünyanın nasıl olduğu konusunda büyük ölçüde haklı. Ama bundan çıkan sonuç konusunda çoğunlukla yanıldığını düşünüyorum.

## **"Biraz daha iyi" neden her şey olabilir**

"Yalnızca biraz daha iyi hipotezler" ifadesi gizli bir varsayım taşıyor: küçük bir avantajın küçük bir fayda demek olduğu. Kantitatif alım satımda çalışmış herkes bunun tam tersinin doğru olduğunu bilir. %52 ihtimalle tura gelen bir madeni para, onu yalnızca bir kez atabiliyorsanız değersizdir; bir milyon kez atabiliyorsanız bir servettir. Optimal (Kelly) pozisyon boyutlandırmasıyla uzun vadeli büyüme, kabaca avantajın *karesiyle* orantılı olarak artar. Küçük bir avantajı ikiye katlarsanız bileşik büyüme hızını dört katına çıkarırsınız. Kumarhaneler, sigortacılar ve en iyi kantitatif fonlar, tek bir örnekte önemsiz görünecek avantajlar üzerine kuruludur.

İndirgenemez dünya zekânın değerine bir tavan koymaz. Onun biçimini değiştirir. Zekâ kehanete benzemekten çıkar, büyük ölçekte uygulanan bir avantaja benzemeye başlar. Burada dört mekanizma önemlidir.

1. **Daha çok deneme.** Eğer belirleyici olan deneme yanılmaysa, bağlayıcı kısıt kaç denemenin bedelini karşılayabildiğinizdir. Bir insan ekibinin üç deney yürüttüğü sürede bin deneyi tasarlayıp başlatabilen ve sonuçlarını okuyabilen bir sistemin dünyayı tahmin etmesine gerek yoktur. Dünyadan örneklem alabilir. Büyük bir teknoloji şirketinin içinde bu şimdiden gözle görülür durumda: Olgun deney platformlarının sağladığı avantaj, tek tek parlak fikirlerden çok, durmaksızın, ucuza ve paralel biçimde yapılan testlerden gelir.
2. **Daha iyi denemeler.** Her deney aynı ölçüde bilgi vermez. Belirsizliği en çok azaltacak deneyi seçmek başlı başına zihinsel bir iştir; insanüstü zekânın da çok işe yarayacağı bir iş. Büyük bir bilim insanının dehası çoğu zaman teoriden çok, hangi ölçümün yapılacağını seçmesinde yatar.
3. **Daha ucuz denemeler.** Bazı denemeler gerçeklikten simülasyona taşınabilir. Hava tahminleri her on yılda kabaca bir gün daha ileriyi işe yarar bir isabetle görebilir hale geldi; bunu indirgenemezlikten kaçarak değil, indirgenemez bir sistemi daha iyi modelleyerek başardı. Fabrikaların, hücrelerin ve tedarik zincirlerinin dijital ikizleri her şeyi tahmin edemeyecek, ama her biri bazı pahalı gerçek denemeleri ucuz sanal denemelere dönüştürecek.
4. **Kalibre edilmiş bilgisizlik.** Belki de en çok hafife alınan armağan: *hangi* soruların indirgenebilir, hangilerinin indirgenemez olduğunu bilen bir süper zekâ. Size "bu bir yazı tura, kendinizi yiyip bitirmeyi bırakın, çabucak seçin ve geri dönme seçeneğini elinizde tutun" demesi son derece değerli bir tavsiyedir. İnsanların karar verirken çektiği sıkıntının büyük kısmı, indirgenemez soruları daha çok düşünerek çözülebilecekmiş gibi ele almaktan kaynaklanır.

Ama itiraz kritik bir biçimiyle ayakta kalıyor; bu da Amdahl yasasının bir versiyonu. Bir sürecin paralel kısmını hızlandırmak, sonunda sizi seri kısmı beklemek zorunda bırakır. Bir ilacın yine de yıllar boyunca insan bedenlerinde test edilmesi gerekir. Bir şirketin yine de müşterileriyle buluşması gerekir. Bir çocuğun yine de büyümesi gerekir. Gerçekliğin bir saat hızı vardır ve ne kadar zekâ olursa olsun bu saatin hızı aşırtılamaz. 2028'in süper zekâsını darboğaza sokan şey düşünmek değil, *dünyayla temas* olacak.

Bu, bütün tabloyu yeniden çerçeveliyor. ASI bir kâhinden çok bir deneycidir ve kıt kaynak artık fikirler değildir. Kıt olan, gerçekliğe dokunmak için gereken izin, bant genişliği ve zamandır.

## **Ona bağımlı olacak mıyız?**

Evet, ve ilk bağımlı olanlar en zeki insanlar olacak. Kulağa paradoksal geliyor ama değil. Daha iyi bir ikinci görüşün değerini bilen ve ne zaman gerçekten daha iyi bir ikinci görüş aldığını ayırt edebilenler tam da zeki insanlardır. 2028'de kararlarının çoğunda sisteme danışan yöneticiler, bilim insanları ve yatırımcılar saf olanlar olmayacak. Ölçüp tartmış olanlar olacak.

Bağımlılığın kendisi yeni bir şey değil. Doktorunuzun teşhisine, pilotunuzun muhakemesine ve muhasebecinizin vergi mevzuatını nasıl yorumladığına bel bağlarsınız; hiçbirini de doğrulayamazsınız. Medeniyet, güvenilen uzmanlıklardan örülmüş devasa bir ağdır. Soru, yapay zekâya bağımlı olup olmayacağımız değil, bunun *ne tür* bir bağımlılık olacağıdır.

**Yetki devri** ile **teslimiyet** arasında önemli bir ayrım var. Yetki devri şu demektir: Bunu kendim yapabilir ve sonucu değerlendirebilirim, ama zamanımı başka bir yerde daha iyi kullanırım. Teslimiyet ise şu demektir: Sonucu değerlendiremiyorum, bu yüzden otoriteye güvenerek kabul ediyorum. Yapay zekâya kod yazdırıp ardından o kodu kendisi gözden geçiren kıdemli bir mühendis yetki devrediyordur. Okuyamadığı kodu yayına alan yeni başlamış bir mühendis ise teslimiyet gösteriyordur. Birinci ilişki bir güç çarpanıdır. İkincisi kırılgandır, çünkü bozulduğunda ses çıkarmaz.

Yetenek arttıkça ilişkimizin giderek daha büyük bir kısmı yetki devrinden teslimiyete kayar. Buna **okunabilirlik açığı** (legibility gap) diyelim: sistemin hakkında akıl yürütebildiği şeylerle bizim kontrol edebildiğimiz şeyler arasındaki mesafe. Doğrulanabilir alanlarda bu açık zararsızdır, çünkü bizim kontrol edemediğimizi doğrulayıcı kontrol edebilir. Bir ispat denetleyicisi, ispatı hiçbir insanın anlamamasını umursamaz. İndirgenemez alanlarda ise bu açık tehlikelidir. Geçmiş başarı siciline yaslanırız; gürültülü alanlarda ise siciller istatistiksel olarak cılızdır. İş stratejisinde verilmiş on isabetli karar beceri de olabilir, şans da; bunu yıllar geçmeden ayırt edemeyiz.

Daha yavaş işleyen bir risk de var: körelme. GPS'i yoğun kullananların uzamsal hafızası ölçülebilir biçimde daha zayıftır. Muhakemesini dışarıya devreden bir kuşak, on yıl sonra muhakemenin bir kas olduğunu fark edebilir. Elif'in hâlâ kendi verdiği %30'luk kararlar en zor olanlar; üstelik tam da kolay %70'lik kısımda artık edinemediği pratiği gerektiren kararlar.

Son olarak, her danışmanlık ilişkisinin er geç gündeme getirdiği soru var: *Kimin çıkarına hizmet ediyor?* Fark ettirmeden kullanıcı etkileşimine, sağlayıcısının gelirine ya da sizi rahat ettirmeye göre optimize edilmiş bir danışman, zekâsı arttıkça daha tehlikeli hale gelir. IQ'su 300 olan bir danışmanın değeri, neredeyse tamamen onun teşviklerinin sizinkilerle örtüşmesine bağlıdır.

## **Arka plandaki rehber**

Gün boyunca bize kendiliğinden yol gösterecek mi? Teknik açıdan neredeyse kesinlikle evet. Bir sistem takviminize, mesajlarınıza, belgelerinize, konumunuza ve sağlık verilerinize erişebildiği anda, bu kadar yetenekli bir şey için ihtiyaçlarınızı önceden kestirmek kolaydır. Bağlayıcı kısıt zekâ değil. *İnsanın dikkati ve özerkliği*.

Her kesintinin bir bedeli vardır. Azıcık işe yarar bir fikri olduğu her an söze karışan bir sistem, her şeye yorum yapan parlak bir meslektaş gibi çekilmez olurdu. İyi tasarlanmış versiyonu ise çok iyi bir yardımcı pilot gibi davranacak: Çoğu zaman sessiz kalacak ve yalnızca araya girmenin beklenen değeri, odağınızı bozmanın maliyetini açıkça aştığında konuşacak. "Bu çeyrek için en önemli olduğunu söylediğiniz şeyle çelişen bir taahhüde girmek üzeresiniz" araya girmeye değer. "Bu e-postayı ifade etmenin biraz daha iyi üç yolu şunlar" değmez.

Rehberliğin daha büyük sonuçlar doğuracak biçimi ise hiç de araya girmek olmayacak. *Küratörlük* olacak. Gelen kutunuzda neyin görüneceğine, takviminizde hangi toplantının yer alacağına, size hangi üç seçeneğin hangi sırayla sunulacağına kim karar veriyorsa, kararlarınızı herhangi bir önerinin yapabileceğinden çok daha fazla o biçimlendiriyordur. Davranışsal iktisatçılar buna seçim mimarisi der. Arka planda çalışan bir yapay zekâ, tarihin en güçlü seçim mimarı olacak; herkesin üzerinde aynı anda ve çoğunlukla görünmeden çalışacak. Mimarinin kimin hedeflerine hizmet ettiğine bağlı olarak bu ya harika olabilir —ne de olsa iyi bir varsayılan seçenek bir armağandır— ya da sessiz sedasız aşındırıcı.

İnsanların bir yelpaze üzerinde dağılacağını tahmin ediyorum. Gündelik lojistikte çoğu kişi, günü için adım adım yol tarifi almayı seve seve kabul edecek; tıpkı bugün artık neredeyse kimsenin yeni bir şehirde ezberden yol bulmaması gibi. Anlam söz konusu olduğundaysa (kimi seveceğimiz, ne üzerinde çalışacağımız, neye inanacağımız) pek çok kişi direnecek, bazıları da hayatlarında bilerek rehbersiz alanlar yaratacak. 2030'a gelindiğinde yardımsız alınan kararın el yapımı nesnenin kültürel statüsüne kavuşması beni şaşırtmaz: daha az verimli, daha kıymetli ve biraz da lüks.

## **Monokültür sorunu**

İndirgenemezlik argümanı burada sürpriz bir yönüyle yeniden karşımıza çıkıyor ve bence bu, yazının en önemli noktası.

İndirgenemez alanlarda ilerleme deneme yanılmadan geliyorsa, ilerlemenin motoru **çeşitliliktir**. Evrimin mutasyonlara ihtiyacı vardır. Piyasaların, fiyatlar konusunda anlaşamayan insanlara ihtiyacı vardır. Bilimin, kimsenin rağbet etmediği hipotezin peşine düşen inatçı araştırmacıya ihtiyacı vardır. Bu bahislerin çoğu tutmaz; tutan birkaçı ise herkesi ileri taşır. Medeniyet, dev ve merkeziyetsiz bir keşif-faydalanma (explore-exploit) algoritması çalıştırır ve bu algoritma, farklı ön kabullere sahip milyarlarca insan farklı bahisler oynadığı için işe yarar.

Şimdi bir milyar insanın her önemli karardan önce aynı üç dört modele danıştığını düşünün. Bahisleri birbiriyle korelasyonlu hale gelir. Aynı girişim fikirleri yatırım alır. Aynı kariyer yolları optimal görünür. Herkes aynı işlemlere yığılır. Kantitatif yatırımcılar bunun küçük bir versiyonunu gördü: Ağustos 2007'de benzer modeller kullanan pek çok fon benzer pozisyonları aynı anda kapatmaya çalıştı ve birbirinden bağımsız görünen stratejiler hep birlikte çöktü. Kararların kâhinlerce yönlendirildiği bir dünya, o kantitatif depremin (quant quake) medeniyet ölçeğindeki bir benzerini yaşama riski taşır: herkes tek tek rasyonel, toplu halde kırılgan.

Daha derin bir kayıp da var. Sizin için beklenen sonucu optimize eden bir danışman, genellikle sizi bilinen en iyi seçeneğe yönlendirir. Oysa toplumun, uzak ihtimallere oynayan, tuhaf yollara sapan, görünüşte optimal olmayan bahislere giren bazı insanlara ihtiyacı vardır. Bilinmeyen bilinmeyenler orada keşfedilir. Kâhin ne kadar iyiyse ortalamaya doğru çekim o kadar güçlü olur ve sistem bir bütün olarak o kadar az keşif yapar.

Bu da tuhaf bir paradoks doğurur: **Kâhin ne kadar iyileşirse, birilerinin bir yerlerde onu görmezden gelmesi o kadar değerli hale gelir.** Bilge bir ASI bunu kavrar ve keşfi etkin biçimde önerirdi: İnsanların bir kısmına "beklenen değer A diyor, ama dünyanın B'yi deneyecek birine ihtiyacı var ve içinde bulunduğunuz koşullar sizi iyi bir aday yapıyor" derdi. İnşa ettiğimiz sistemlerin bu kadar bilge mi olacağı, yoksa herkesi basitçe ortak kabul gören optimumda mı buluşturacağı, IQ'larından daha önemli olabilir.

## **Ya da bambaşka bir şey**

Buraya kadar anlattığım her şey tanıdık bir biçim varsayıyor: bir insan, çok zeki bir danışman, bir sohbet. Bu biçimin bir geçiş dönemine ait olduğundan şüpheleniyorum; tıpkı otomobile bir zamanlar verilen "atsız araba" adının da bir geçiş dönemi adı olması gibi. Daha tuhaf bazı olasılıklar:

**Bir muhatap değil, bir ortam haline gelir.** Elektrik şebekesiyle ya da tahvil piyasasıyla sohbet etmeyiz. Onların içinde yaşarız. 2028'e gelindiğinde yapay zekâyla "etkileşim" dediğimiz şeyin büyük kısmı makineden makineye gerçekleşiyor olabilir: Ajanınız havayolu şirketinin ajanıyla pazarlık ediyor, şirketinizin sistemleri tedarikçilerin sistemleriyle eşgüdüm sağlıyor, araştırma ajanları başka araştırma ajanlarıyla sonuç alıp veriyor. İnsanlar özetleri görecek, kısıtları belirleyecek ve istisnai durumlarda müdahale edecek. "IQ'su kaç?" diye sormak, internetin kaç beygir gücünde olduğunu sormak gibi gelecek.

**Kıt insan becerisi, ne istediğimizi bilmek haline gelir.** İşin yapılması neredeyse bedava olduğunda darboğaz bir adım geriye, işin tarifine kayar. Yapay zekâ araştırmacıları, makineler için hedefleri tarif etme problemi üzerinde yıllarca çalıştı. İroni şu ki süper zekâ bunu bir insan problemine dönüştürüyor. Kariyerimden, şirketimden, şehrimden aslında ne istiyorum? Çoğumuz bu sorulara hiçbir zaman net bir cevap vermek zorunda kalmadık, çünkü işi yapmak, muğlaklığı gizleyecek kadar zordu. O örtü kalkmak üzere.

**İnsanlar gerçekliğe ve meşruiyete açılan arayüz haline gelir.** Darboğaz dünyayla temassa, insanlar makinelerin kolay kolay sağlayamayacağı üç şeyi elinde tutar: fiziksel dünyadaki bedenler, rıza gösterme hakkı ve hesap verebilecek bir muhatap olma sıfatı. Klinik çalışmaların gönüllülere ihtiyacı vardır. Yasaların seçmenlere ihtiyacı vardır. Birine zarar veren kararların, onların hesabını verecek birine ihtiyacı vardır. Rolümüz, "düşünen kişi" olmaktan çok "evet diyen, sonuçlara katlanan ve ona anlam veren kişi" olmaya benzeyebilir.

**Onunla, bilimle kurduğumuz türden bir ilişki kurarız.** Modern fiziği takip edebilen insan azdır, yine de onun çıktılarına kurumlar aracılığıyla güveniriz: hakem değerlendirmesi, tekrarlanabilirlik, geçmiş başarı sicili. ASI ile olgun bir ilişki de buna benzeyebilir: her tavsiyenin kişisel olarak anlaşılması değil, onu denetleyen, çapraz kontrol eden ve ona itiraz eden kurumsal bir mekanizma. 2028'in en önemli teknolojileri, süper zekâyı *itiraz edilebilir* kılanlar olabilir: rakip modeller, çekişmeli denetim, şeffaf belirsizlik ve hayır deme hakkı.

## **Kapanış: beklemek zorunda olan kâhin**

Peki IQ'su 300 olan bir makine hayatlarımıza yön verecek mi? Doğrulanabilir dünyada yön vermekten fazlasını yapacak: Çözecek, biz de onun işini çoğunlukla başka makinelerle kontrol edeceğiz. İndirgenemez dünyada ise bir kehanet makinesi olmayacak. Daha ilginç bir şey olacak: yorulmak bilmeyen bir deneyci ve kalibre edilmiş bir danışman. İyi seçilmiş denemelerin sırf sayıca çokluğuyla küçük avantajları büyük avantajlara dönüştürecek ve hangi soruların ne kadar düşünülürse düşünülsün karara bağlanamayacağı konusunda dürüst olacak.

Denetleyemediğimiz her uzmana bağımlı olduğumuz gibi ona da bağımlı olacağız. Tehlike bağımlılığın kendisi değil. Tehlike, daha sessiz üç başarısızlıkta yatıyor: yetki devri gereken yerde teslimiyet, en zor kararlar için hâlâ ihtiyaç duyduğumuz muhakemenin körelmesi ve medeniyeti, öğrenmesini sağlayan çeşitlilikten yoksun bırakan bir karar monokültürü.

En derin ironi şu: Süper zekâ sonunda bize, tam da kendisini sınırlayan şeyin değerini öğretebilir. Dünya indirgenemez; bilinmesi için yaşanması gerekir. Ne büyüklükte olursa olsun her zihin, yine de gerçekliğin cevap vermesini beklemek zorundadır. O bekleyişte, neyi deneyeceğimizi, neyi isteyeceğimizi ve neyi göze alacağımızı seçerken, denklemin insan tarafı ortadan kalkmaz. En çok önem taşıyan taraf haline gelir.
