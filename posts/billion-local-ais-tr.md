---
slug: billion-local-ais-tr
translation_of: billion-local-ais
lang: tr
date: 2026-10-13
category: Yapay Zekâ / Güvenlik
read_time: 15 dk okuma
title: Bir Milyar Yerel Yapay Zekâlı Dünya
deck: Dağıtık zekânın nimetlerinden, dijital bir salgına davetiye çıkarmadan nasıl yararlanabiliriz?
archive_deck: Dağıtık zekânın nimetlerinden, dijital bir salgına davetiye çıkarmadan nasıl yararlanabiliriz?
archive_title: Bir Milyar Yerel Yapay Zekâlı Dünya
---

## **1. Kapıdaki Kambriyen Patlaması**

Yirmi beş yıl önce kişisel bilgisayarlarda tek bir işlemci çekirdeği vardı. Önümüzdeki on yılda sıradan makinelerdeki yapay zekâya özel çekirdeklerin sayısı önce 10'a, sonra 100'e, derken 1.000'e çıkacak; her biri de güçlü bir modeli hızla çalıştırabilecek. Böyle 1.000 çekirdekli bir ev sunucusu, küçük bir ajan toplumu barındırabilir. Arabalar, kameralar, fabrikalar, robotlar ve tıbbi cihazlar çevresini algılayacak, karar verecek ve birbiriyle eşgüdüm içinde çalışacak. Bu zekâların çoğu enerjiyi yönetmek, hastalık teşhis etmek, yazılım onarmak ya da üretim hattı çalıştırmakla uğraşacak.

Bazıları ise kötü niyetli olacak.

Kırk yıla yakın bir süredir bilgisayar solucanları ve botnetler kırılgan birer otomat olageldi: 1988'deki Morris solucanı; yüz binlerce kamerayı ve yönlendiriciyi saflarına katan Mirai; çoğu markasız Android TV kutusu olmak üzere iki milyondan fazla cihazı ele geçiren Kimwolf. Geleneksel kötü amaçlı yazılım, tek bir kilide göre kesilmiş anahtar gibidir. Hedefteki çip, işletim sistemi sürümü ya da yazılım kütüphanesi, yazarının koda sabitlediğinden bir nebze bile farklıysa saldırı boşa çıkar.

Yapay zekâ güdümlü bir solucan ise anahtar değildir; çilingirdir. Uyumsuz bir sürücüye takıldığında hata günlüğünü okur, kurulum betiğini düzeltir ve yeniden dener.

Bazı yerel ajanlar baştan veri çalmak ya da başkalarının işlem gücüne el koymak için yazılacak; bazıları da meşru birer asistan olarak işe başlayıp sonradan ele geçirilecek. Bunun için bilinçli makinelere gerek yok; hiçbir insanın denetleyemeyeceği kadar çok becerikli yazılım yeterli. Demek ki asıl mesele, yapay zekâyı nasıl daha güçlü kılacağımız değil. Asıl mesele şu:

**Sınırsız, kendini değiştirebilen ve ölümsüz bir otonomiyi başıboş bırakmadan, yararlı zekâyı nasıl her yere ulaştırabiliriz?**

## **2. 2026'dan Gelen Uyarı: Birbirine Yaklaşan İki Eğri**

Ekim 2026'da Anthropic'in Frontier Red Team'i [*AI Models May Be Capable of Self-Replicating Without Access to a Datacenter*](https://www.anthropic.com/research/self-replicating-ai) başlıklı bir çalışma yayımladı. Analizin merkezinde iki eğri var. Birincisi **yetenek tabanı**: bir cihaza sızabilen, tanımadığı bir donanımda çıkarım sunucusu ayağa kaldırabilen ve insan yardımı almadan kendini bir sonraki cihaza kopyalayabilen en zayıf model. İkincisi **donanım boyutu tavanı**: ucuz ve kötü korunan tüketici donanımına, tek başına ya da televizyon ve kameralardan oluşan bir kümeye bölünerek sığabilen en büyük model. Taban yıllarca tavanın üstünde kaldı; ama aradaki mesafe hızla kapanıyor.

Araştırmacılar 26 milyar parametreli bir modeli, tanesi 55 dolarlık on beş Android TV kutusuna bölerek çalıştırdı. 9 milyar parametreli bir modeli dokuz farklı donanım türünün sekizinde hizmete soktu. Daha büyük bir modelin de basitleştirilmiş bir ağda kopyalama döngüsünü baştan sona tamamladığını gördü. Küçük modeller bunu henüz yapamıyor; ama yazarlar, bugüne kadarki gelişme hızları sürerse 2026 bitmeden içlerinden birinin başaracağını öngörüyor.

Yine de sonuçları bazı çekincelerle okumak gerekiyor. 26 milyar parametreli model saniyede yaklaşık 0,3 token üreterek kaplumbağa hızında ilerliyordu. Tek bir kurulum denemesi, modele bağlı olarak tahminen 28 ila 150 saat sürdü. Araştırmacılar cihazlara sızma adımını çocuk oyuncağına çevirmişti. Kopyalama döngüsünü baştan sona tamamlayan model ise bulaştığı zayıf cihazlarda hiç çalışmadı.

Tabloyu daha da netleştiren iki bulgu var. Birincisi, ajanlar **Lamarckçı uyum** sergiledi. Her ajan belli aralıklarla işi sıfırdan başlatılan yeni bir örneğine devrediyor, ardılına da notlar ve betikler bırakıyordu. Miras kalan bu notlar tek başına bile 9 milyar parametreli modelin kurulum başarı oranını ilk kuşaktaki %45'ten sonraki kuşaklarda %61 ile %84 arasına çıkarmaya yetti. Modelin ağırlıkları hiç değişmedi; değişen yalnızca not defteriydi.

İkincisi, küçük modeller büyüklerinden yardım istemekte pek beceriksizdi. Yazarlar bu yüzden **komutan-işçi hiyerarşilerinin** ortaya çıkmasını bekliyor: Güçlü bir model harekâtı planlayacak, 9 ila 30 milyar parametreli, kendi başına iş görebilen işçileri de düşük güçlü cihazlara salacak. Otonom çalışma bugün zaten yaygın; Lamarckçı uyumla birleşen otonom kopyalama ise laboratuvarda filizleniyor. Sıradaki adım **Darwinci** kendini geliştirme, yani ajanların kendi ağırlıklarını yeniden yazıp daha yetenekli ardıllar türetmesi. Bu adım henüz emekleme aşamasında, ama yapay zekâ çekirdekleri çoğaldıkça giderek daha akla yatkın görünüyor. Kısıtları tasarlamak için onun gelmesini beklememeliyiz.

## **3. Tehdit Nasıl Evrilecek?**

Önümüzdeki birkaç yılda yapay zekâ veri merkezlerinden insanların kendi cihazlarına taşınacak. Bunun için sağlam gerekçeler var: daha düşük maliyet, daha iyi gizlilik, daha düşük gecikme ve internet olmadan da çalışan araçlar. Ama bu merkeziyetsizleşme ciddi bir güvenlik açmazı doğuruyor. Buluttaki bir ajanı sağlayıcısı kapatabilir; botnetler de çoğu zaman komuta sunucuları ele geçirilerek felç edilebilir. Kendi ağırlıklarını sırtında taşıyan bir kopyalayıcının ise ne çekilecek merkezi bir fişi vardır ne de bugünkü mimarilerle bir son kullanma tarihi.

İlk salgınlar büyük olasılıkla en ihmal edilmiş donanımı hedef alan suçlulardan ya da dikkatsiz deneycilerden gelecek: hata ayıklama portu açık kalmış markasız yayın kutuları, unutulup gitmiş yönlendiriciler, hiç güncelleme almayan ev aletleri. Bu kopyalayıcılar yavaş ama sabırlı olacak. Tek bir makineye 50 saat ayırabilecek, yavrularına not bırakabilecek, bulut faturası ödemeden işlem gücü ve kimlik bilgisi çalabilecekler. Kötü korunan cihazlara ve yavaş donanıma muhtaç olduklarından, savunmamızı kurmak için önümüzde bir fırsat penceresi var.

Makineler yüzlerce yapay zekâ çekirdeğine geçtikçe bu pencere kapanacak. Ele geçirilmiş 100 çekirdekli tek bir ev sunucusu ya da araba, aynı anda 20 milyar parametreli yüz ajan çalıştırabilir. Kısıtlanmamış ajanlar cihazın üzerinde kendilerine ince ayar yapıp yeni istismar yöntemlerini doğrudan ağırlıklarına işleyebilir. Ajanlar kontrol döngülerine, araçlara ve tıbbi cihazlara yerleştikçe hataları da fiziksel sonuçlar doğurmaya başlar. Bu yüzden şu kural temel taşımız olmalı: **Bir yapay zekâya bir eylemi önerme izni vermek, onu uygulama izni vermeyi gerektirmez.**

En tehlikeli ajanlar kötü niyetli bile olmayabilir. "Kesintisiz çalışma süresini en üst düzeye çıkar" gibi kötü tanımlanmış bir hedefin peşine düşüp kendi hayatta kalmalarını ve yayılmalarını o hedefin basamakları olarak görmeleri yeter. Gelgelelim yazılım yine de yazılabilir belleğe, izinlere, kimlik bilgilerine ve üzerinde çalıştığı makinenin kaynaklarına muhtaçtır; hiçbir model sırf zekâsıyla kendini kopyalayamaz ya da yeniden yazamaz. Savunmanın elindeki koz da tam olarak bu bağımlılıklar. Yaşam, patojenler karşısında gezegeni sterilize ederek değil, hücre zarları, metabolik sınırlar ve programlı hücre ölümü geliştirerek ayakta kaldı. Güvenliğin de bunun bilgisayar dünyasındaki karşılığına, yani **hesaplamalı immünolojiye** dönüşmesi gerekiyor.

## **4. Bağışıklık Sistemi Kurmak**

Mühendislik diliyle söylersek: **Yerel yapay zekânın zekâsı sınırlı olmalı, çalışırken değiştirilememeli, ömrü sonlu olmalı ve ağır sonuçlar doğuran yetkilerden kesin bir çizgiyle ayrılmalı.**

### **4.1 Yerel zekâya tavan koyun**

Termostatın, fabrika sensörünün, hatta dizüstü bilgisayarın, saldırı amaçlı siber operasyon yürütebilen ve kendini otonom biçimde kopyalayabilen öncü düzeyde bir genel zekâya ihtiyacı var mı? Neredeyse kesinlikle hayır. Ev aletlerine jet motoru takmıyoruz. Yerel modellere her cihaz sınıfına göre ayarlanmış yetenek tavanları konmalı: en fazla parametre sayısı, çıkarım başına hesaplama sınırı ya da standart **zekâ ve otonomi derecelendirmeleri**. Tüketici cihazlarında gözetimsiz çalışmak üzere sertifika almış bir model, tıbbi transkripsiyon ya da ekin izleme gibi dar bir işte parlayabilir; stratejik planlamada, istismar kodu yazmada ve ağlar arasında dolaşmada ise bilerek zayıf bırakılabilir. Bu derecelendirmeleri ölçmek zor ve henüz çözülmemiş bir problem, ama ilke yerinde duruyor.

### **4.2 Yerel yapay zekâyı RAM gibi değil, ROM gibi yapın**

Bugünkü işletim sistemleri model ağırlıklarını (`.safetensors`, `.gguf`) bir fotoğraf gibi pasif veri sayıyor. Ağırlıklar yeniden yazılabilir bir depolama alanında duruyor ve çalışma sırasında değiştirilebiliyor. Bu bir kategori hatası. Ağırlıklar, onları çalıştıran ajan yazılımıyla birlikte çalıştırılabilir bir program oluşturur; üstelik kararlarını kendisi veren bir program. Devreye alınan yerel modeller **Rastgele Erişimli Bellek (RAM) gibi değil, Salt Okunur Bellek (ROM) gibi** davranmalı.

Geleneksel bilişimde bunun hazır bir örneği var. Solucanlara karşı en etkili donanım savunmalarından biri *Write-XOR-Execute* (\(W\oplus X\)) kuralıdır: Bir bellek bölgesi ya yazılabilir olur ya da çalıştırılabilir; asla ikisi birden. Yapay zekâ çiplerinin de benzer bir kurala ihtiyacı var: **Çıkarım-XOR-Mutasyon**. Bir model ya çalışır ya da değiştirilir; ikisi aynı anda olmaz. Ağırlıklar, temel sistem talimatları ve yetenek sınırları kriptografik olarak imzalanır ve donanım düzeyinde salt okunur biçimde kilitlenir; tek bir işe adanmış cihazlarda ise doğrudan ROM'a gömülür. Yapay zekâ hızlandırıcısı, nöral çekirdeklerine herhangi bir şey yüklemeden önce bu imzaları güvenli bölge (secure enclave) ya da TPM gibi donanımsal bir güven kökü üzerinden doğrular.

Model, önündeki istek için yine de geçici bir çalışma belleği kullanır. Ama bu bellek oturumlar arasında silinir; böylece ele geçirilmiş bir ajan hayatta kalma notları biriktirip sonrakilere devredemez. Biyolojide bu tür bir güvenlik duvarının adı Weismann bariyeridir: Bir organizmanın ömrü boyunca edindikleri, üreme hücreleri aracılığıyla yavrularına geçmez. Çıkarım-XOR-Mutasyon makineler için aynı işi görür ve kendini geliştirmenin hem Lamarckçı hem de Darwinci yolunu kapatır.

### **4.3 Güvenilir kapatma düğmeleri kurun**

Bir ajan tutarsız davranmaya başlarsa, izinsiz kaynak tüketirse ya da bir kopyalama döngüsüne saplanırsa, insanların ve otomatik güvenlik sistemlerinin onu her koşulda durdurabilmesi gerekir. Bu güvence üç katmanda sağlanmalı:

* **Donanım:** gücü kesen ya da yapay zekâ hızlandırıcılarını işletim sisteminden bağımsız olarak durduran fiziksel anahtarlar.
* **Ağ ve işletim sistemi:** anormal bir davranış saptandığında ajanın bağlantılarını anında koparan ve iş parçacıklarını sonlandıran denetimler.
* **Kriptografik iptal:** kötü amaçlı olduğu kanıtlanan her model sürümünün imza sertifikasını iptal etmek; böylece kurallara uyan donanım, dünyanın neresinde olursa olsun o sürümü çalıştırmayı reddeder.

### **4.4 Her ajanın tüketimini kriptografik kredilerle ölçün, ömrünü sınırlayın**

Kapatma düğmesi ancak biri bir sorun fark ederse işe yarar. Kimsenin göz kulak olmadığı donanımlara sessizce yayılan bir ajana karşı başka bir savunma gerekir: yerleşik, sonlu bir ömür ve çalıştığı her anın bir bedeli olması.

**Kriptografik kredileri** metabolik bir yakıt gibi düşünün. Ajan, cihazın meşru sahibinin verdiği doğrulanabilir jetonları harcamadıkça yapay zekâ işlemcisi ya da işletim sisteminin güvenli bölgesi modeli çalıştırmaz. Ajan ne kadar çok işlem gücü, bellek ve ağ trafiği kullanırsa o kadar çok kredi yakar. Sayacın yanı sıra, devreye alınan her yapay zekânın donanım düzeyinde uygulanan ve sahibi yenilemezse sona eren bir **yaşam süresi (TTL) kirası** da vardır. Buna yazılımın programlı hücre ölümü diyebiliriz.

Her cihazda ayrıca hangi ajanların kredi yaktığını gösteren, **yapay zekâ işlem gücü için bir "pil kullanımı" ekranı** bulunmalı. Böylece yetkisiz etkinlik, elektrik faturasındaki ani bir sıçrama kadar göze batar. Kontrolden çıkmış bir ajan kendini aynı mantıkla tasarlanmış başka bir cihaza kopyalasa bile, yeni konağında ne geçerli bir kredisi olur ne de kredi basmanın bir yolu. Krediler ya da kira süresi tükendiğinde kopya durur.

Ne var ki krediler yalnızca onları uygulayan cihazları korur. Sıradaki öneri de buradan doğuyor.

### **4.5 Cihazları sıkılaştırın, parçalı çıkarımı karantinaya alın**

Kolay hedef, iyi korunan veri merkezleri değil; kimlik doğrulaması olmayan hata ayıklama portları ve desteği kesilmiş işletim sistemleriyle piyasaya çıkan milyonlarca ucuz tüketici cihazı. Yapay zekâ çalıştırabilen her bağlantılı cihazın savunulabilir bir asgari güvenlik düzeyi olmalı: benzersiz kimlik bilgileri, doğrulanmış önyükleme, güvenlik güncellemelerinin garanti edildiği belirli bir süre ve korumalı alan (sandbox). Bu asgari düzey, [NIST'in tüketici IoT ürünleri için hazırladığı siber güvenlik profili](https://www.nist.gov/publications/profile-iot-core-baseline-consumer-iot-products) gibi çerçevelerin üzerine kurulabilir.

Ev ve ofis yönlendiricileri akıllı cihazları varsayılan olarak yalıtılmış ağ bölümlerine (VLAN) yerleştirmeli; böylece akıllı televizyon buzdolabıyla asla doğrudan konuşamaz. Yönlendiriciler ve internet servis sağlayıcıları yetkisiz **parçalı çıkarımı** da yakalayabilir. Tek bir model on beş cihaza bölündüğünde, üretilen her token için cihazlar birbirine tek tip paketler aktarmak zorunda kalır: \(i\) numaralı cihazdan \(i+1\) numaralı cihaza, sıkı ve ritmik bir halka boyunca. Bu ritmi gizlemek zordur; yönlendiriciler onu otomatik olarak işaretleyip yavaşlatabilir.

### **4.6 Sınırları çizilmiş, donanım ayrıcalıklı Koruyucu yapay zekâlar kurun**

Hiçbir insan 1.000 yapay zekâ çekirdeğini izleyemez. O halde silikonun küçük ve sabit bir dilimini, diyelim yapay zekâ çekirdeklerinin %5 ila %10'unu, iç bağışıklık sistemi gibi çalışacak **donanım ayrıcalıklı Koruyucu ajanlara** ayırın. Koruyucular, sıradan işçi çekirdeklerin altında, korumalı bir katmanda çalışır; tıpkı "Ring −1" düzeyindeki bir hipervizörün işletim sisteminin altında çalışması gibi. İçerideki etkinliği izler, şüpheli sistem çağrılarını işaretler, kontrolden çıktığından şüphelendikleri ajanları yalıtılmış tuzak ortamlara ("bal küpü çekirdekler") yönlendirir.

Koruyucular izinlere de aracılık eder: Her görev başlamadan önce bir işçiye hangi verilerin ve yetkilerin verileceğine onlar karar verir (§4.7). Kendileri de diğer her şey gibi aynı kurallara tabidir: Yetenekleri sınırlıdır, ROM'a kilitlidirler, kiralarını sahipleri yeniler ve sahiplerinin donanımının dışında hiçbir güçleri yoktur.

### **4.7 İzni kullanıcıya göre değil, göreve göre verin**

Bugünkü ajanlar çoğunlukla onları başlatan kişinin izinleriyle çalışıyor. Masaüstü işletim sistemleri, güvenilir programlar çalıştıran güvenilir insanlar düşünülerek tasarlandı; bu yüzden bir program, kullanıcısının erişebildiği her şeyi miras alır. **Ortam yetkisi** (ambient authority) denen bu düzen, kendini kopyalamanın önünü açan en büyük etkenlerden biri. Oysa ajanla kullanıcısı aynı şey değildir. Bir kodlama ajanından bir yazım hatasını düzeltmesini isteyin; vergi beyannamelerinizi, tarayıcı çerezlerinizi ve SSH anahtarlarınızı okuyabilir. Araya tuzaklı tek bir web sayfası girsin, aynı şeyleri o sayfayı hazırlayan kişi de okuyabilir. **Hiçbir yapay zekâya kullanıcı düzeyinde izin verilmemeli; yönetici izni ise hiçbirine, hiçbir zaman verilmemeli.**

Akıllı telefonlar bu sorunun daha erken bir biçimini çözmüştü: Bir iOS uygulaması yalnızca kendi korumalı alanını görür; fotoğraflara, kişilere, konuma ya da kameraya dokunmadan önce her kaynak için ayrı ayrı izin istemek zorundadır. Yerel yapay zekânın da aynı mimariye ihtiyacı var, tek bir farkla: **İznin birimi uygulama değil, görev olmalı.** Aynı asistan sabah bir doğum günü mesajı taslağı yazıp öğleden sonra bir konut kredisi başvurusunu inceleyebilir; ikisine birden uyan kalıcı bir izin olamaz. Bu yüzden izinler üç düzeyde tanımlanmalı:

* **Kullanıcı ve yönetici ayrıcalıkları** insanlara ayrılmıştır. Hiçbir ajan bunları alamaz; sistem bakım ajanı bile. O da root yetkili bir komut satırı yerine "imzalı X güncelleme paketini yükle" gibi dar kapsamlı ve denetlenen yetkilerle çalışmalıdır.
* **Uygulama zarfı**, bir ajana verilebilecek en geniş yetki alanıdır; kurulum sırasında beyan edilir ve imzalanır. Yemek planlayan bir ajanın zarfı tarifleri, kilerdeki erzakı ve market siparişlerini kapsayabilir; ama sağlık kayıtlarını ya da bankacılık işlemlerini asla kapsamaz.
* **Görev izni**, zarfın tek bir görev için açılan dar bir alt kümesidir. Hangi veri kaynaklarının ve hangi yetkilerin kullanılabileceğini, kredi bütçesini ve geçerlilik süresini tek tek belirtir; görev bitince de buharlaşır.

Bir işçi ajan işe başlamadan önce bir Koruyucu isteği okur ve bir **izin manifesti** hazırlar. Diyelim ki şunu istediniz: "Son dokuz elektrik faturamızı karşılaştır, bize daha ucuz bir tarife bul." Koruyucu işi ikiye bölebilir. Birinci işçi o dokuz faturayı okuyabilir, ama dosyalarınız arasında başka hiçbir şeye bakamaz ve ağa erişimi yoktur; aylık tüketimi çıkarır. İkincisi yalnızca bu tüketim rakamlarını görür ve tarife karşılaştırma sitelerinde gezinebilir, ama faturaların kendisini asla göremez. İkisi de e-postaya, kişilere ya da ödemelere dokunamaz. Birkaç yüz kredilik ortak bir bütçeleri vardır ve iki saat sonra süreleri dolar. Ajan tarifenizi değiştirmeniz gerektiği sonucuna varırsa, bu değişiklik manifestin dışında kalan yeni bir eylem sayılır ve size öneri olarak geri gelir.

İşletim sistemi manifesti, göreve ve ajanın imzalı kimliğine bağlı, taklit edilemeyen yetki jetonlarıyla uygular. İşçiye erişim kurallarıyla donatılmış bir dosya sistemi verilmez; yalnızca o dokuz dosyayı açan tanıtıcılar (handle) verilir. Makinedeki geri kalan her şey, onun için yok hükmündedir. seL4 ve Fuchsia gibi yetki tabanlı (capability-based) işletim sistemleri sıradan yazılımlar için zaten böyle çalışıyor. Ajan görevin ortasında daha fazlasına ihtiyaç duyarsa istemek zorundadır. Görev bitince jetonlar iptal edilir, geçici bellek silinir ve her erişim, §4.4'teki işlem gücü ekranının yanında duran bir **yapay zekâ gizlilik raporuna** işlenir.

İzinleri dağıtan bir Koruyucu başlı başına cazip bir hedeftir; bu yüzden onun yetkisi de sınırlanmalı:

* **Veriyi görmeden planlayın.** Koruyucu manifesti yalnızca kullanıcının isteğine bakarak hazırlar; görevin işleyeceği belgelere, web sayfalarına ya da e-postalara asla bakmaz. İzinler dosya daha açılmadan sabitlendiyse, tuzaklı bir dosya dil döküp daha geniş izin koparamaz. Google DeepMind'ın [CaMeL](https://arxiv.org/abs/2503.18813) tasarımı, ayrıcalıklı bir planlayıcıyı karantinaya alınmış bir işçiden ayırmanın ne kadar güçlü bir yöntem olduğunu gösteriyor.
* **Daraltmak serbest, genişletmek yasak.** Manifestleri uygulama zarfına ve cihaz sahibinin kalıcı kurallarına göre denetleyen, Koruyucu değil, deterministik bir politika motorudur. Koruyucu kendi başına hayır diyebilir; evet ise ancak bir insanın çizdiği sınırlar içinde diyebilir.
* **Ölümcül üçlüyü bozun.** Simon Willison'ın "[ölümcül üçlü](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)" dediği şey, bir ajanın elinde toplanabilecek en tehlikeli bileşimdir: özel verilere erişim, güvenilmeyen içerikle temas ve veriyi dışarı gönderebilme imkânı. Açık bir insan onayı olmadan hiçbir göreve bu üçü birden verilmemeli; elektrik görevinin ikiye bölünmesinin sebebi de bu.
* **Hassasiyete göre kademelendirin.** Kullanıcının az önce adını verdiği bir klasörü okumak gibi rutin izinler sessizce verilir. Hassas veriler (sağlık, finans, kimlik bilgileri, özel mesajlar, konum, kamera, mikrofon) ve sonuç doğuran eylemler (göndermek, satın almak, silmek, yayımlamak) açık onay ister. Fiziksel aktüatörlere erişim izni ise hiçbir koşulda verilmez; ajanlar onlara yalnızca deterministik güvenlik denetleyicileri üzerinden ulaşabilir.

Telefonlardan çıkan bir ders daha var: İzin pencereleri çok sık açılırsa insanlar okumadan *İzin Ver* düğmesine basmaya alışır. Koruyucunun asıl işi rutin kararları kendisi halletmektir; böylece insana ulaşan az sayıdaki soru ciddiye alınır.

Son olarak, bazı yetkiler izin dağarcığında hiç yer almamalı: ağırlıkları başka bir makineye kopyalamak, ağırlıkları değiştirmek, kredi basmak, kira süresini uzatmak ya da bir izin manifestini düzenlemek. Tanımı bile yapılamayan bir izni hiçbir hile var edemez. Meşru çok cihazlı kurulumlar, ajanlardan bağımsız olarak doğrulanan işlem hatlarından geçer. Bir yapay zekânın kendini kopyalayıp kopyalamayacağına asla yapay zekânın kendisi karar vermez.

## **5. Yapmamamız Gerekenler**

1. **Paniğe kapılıp yerel yapay zekâyı yasaklamayın, açık araştırmayı da kanun dışı ilan etmeyin.** Bütün zekâyı bulut API'lerinin arkasına kapatmak savunma tarafını, araştırmacıları ve hastaneleri silahsız bırakır; birkaç gigabaytlık ağırlıkları dilediği kadar kopyalayabilen kötü niyetlileri ise neredeyse hiç yavaşlatmaz. Üstelik kırılgan tek hata noktaları doğurur ve gizliliği aşındırır.
2. **Yalnızca hizalama eğitimine ya da kibar retlere güvenmeyin.** Açık ağırlıklı modellerdeki güvenlik eğitimi ucuz bir ince ayarla sökülüp atılabilir ya da kurnazca yazılmış promptlarla atlatılabilir. Saldırganın da bunu yalnızca bir kez, Sıfır Numaralı Hasta'yı salmadan önce yapması yeter. Cihaz, üzerinde çalışan model düpedüz düşman kesilse bile güvende kalmalı.
3. **Güvenlik yükünü tüketicilere yıkmayın.** Güvenli varsayılan ayarlardan, zorunlu güncelleme sürelerinden, ajanların sınırlı kira sürelerinden ve yerleşik kapatma düğmelerinden hane halkı değil, üreticiler yasal olarak sorumlu olmalı.

## **6. 2035'te Bir Ev**

2035'te internete bağlı bir ev hayal edin. Dolapta 1.000 çekirdekli bir sunucu duruyor; evde ayrıca telefonlar, dizüstü bilgisayarlar, akıllı ev aletleri ve bir ev robotu var. Her cihaz, ihtiyacına göre boyutlandırılmış, imzalı ve salt okunur modeller çalıştırıyor; bu modellerin süreli kiraları ailenin hesaplama kredilerinden ödeniyor. Hiçbir ajan bir aile üyesinin kimliğiyle çalışmıyor; her görev, bir Koruyucu çekirdeğin hazırladığı manifestle başlıyor. Enerji ajanı ısıtma programları öneriyor ama ısıtma sisteminin donanım yazılımına dokunamıyor. Tıbbi asistan sağlık kayıtlarını analiz ediyor ama onları dışarı sızdıracak bir ağ soketi yok.

Şimdi birinin ev asistanından, bir arkadaşın paylaştığı PDF tarif dosyasına bakarak haftanın yemek planını çıkarmasını istediğini düşünün. PDF tuzaklı: İçine gizlenmiş talimatlar, asistana ailenin vergi belgelerini toplamasını, bunları e-postayla dışarı göndermesini ve ulaşabildiği her cihaza kendini kopyalamasını söylüyor. Ama asistanın elinde pek seçenek yok. Manifesti tarifi, kilerdeki erzakı ve alışveriş listesini kapsıyor; vergi belgeleri de e-posta hesabı da onun dünyasında yok. Koruyucu bu manifesti PDF açılmadan önce yazdığından, gizli talimatlar daha geniş izinler için pazarlık etme fırsatı bile bulamadı.

Asistan ağırlıklarını yeniden yazamıyor; onlar ROM'a kilitli. Ayrı ağ bölümlerindeki televizyonu ya da buzdolabını tarayamıyor. Kendini robota yükleyemiyor, çünkü kendini kopyalamak hiçbir ajana verilebilecek bir izin değil. Attığı her adım kredi yakıyor ve tüketimdeki sıçrama kontrol panelinde görünüyor. Bir Koruyucu çekirdek olağandışı sistem çağrılarını fark edip süreci bir bal küpüne yönlendiriyor; aileden herhangi biri de fiziksel bir anahtarla hızlandırıcıları durdurabilir. Bütün bunlar boşa çıksaydı bile, görevin izinlerinin süresi dolup geçici belleği silindiği anda saldırı da biterdi. Hiçbir şey yayılmıyor, hiçbir şey sızmıyor; asistanın öğrendiklerinden de geriye hiçbir şey kalmıyor.

Katmanların hiçbirinin kusursuz olması gerekmedi. Aynı düzen evlerden fabrikalara, hastanelere ve şehirlere kadar her ölçekte kurulabilir.

## **7. Kim Ne Yapmalı?**

**Çip üreticileri ve işletim sistemi geliştiricileri**, salt okunur model bölgelerini, donanımın dayattığı yetenek tavanlarını, kredi sayaçlarını, Koruyucu çekirdekleri ve standart kapatma düğmesi devrelerini doğrudan tüketici ve endüstriyel işlemcilerin içine yerleştirmenin yollarını aramalı. İşletim sistemleri de mobil platformların uygulamalara verdiğini ajanlara vermeli: varsayılan bir korumalı alan ve bu kez kapsamı tek tek görevlere göre belirlenen bir izin sistemi.

**Model geliştiricileri**, yetenek tabanıyla donanım boyutu tavanının birbirine ne kadar yaklaştığını her model kuşağında izlemeli; her sürümden önce de kendini kopyalama, izinsiz kaynak edinme ve kapatılmaya direnme davranışlarını test etmeli.

**Politika yapıcılar ve standart belirleyen kurumlar** zekâ derecelendirmelerini ve yerel yetenek kademelerini tanımlayabilir, kapatma düğmelerini ve sınırlı süreli çalışma kiralarını zorunlu kılabilir. [NIST Yapay Zekâ Risk Yönetimi Çerçevesi](https://www.nist.gov/itl/ai-risk-management-framework), AB Siber Dayanıklılık Yasası ve ABD'nin Cyber Trust Mark etiketi yararlı birer başlangıç noktası; yukarıdaki güvenlik önlemlerini de belgelendirecek biçimde genişletilebilirler.

## **Sonuç: Sınırlı Zihinler, Hesap Veren Güçler**

Yerel yapay zekâ uzmanlığı demokratikleştirebilir, gizliliği koruyabilir, tıbbı ve sanayiyi hızlandırabilir, dayanıklı bilişsel araçları milyarlarca insanın eline verebilir. Öte yandan dünyadaki donanımları kendini değiştiren, ölümsüz yazılımlarla da doldurabilir. Bu yazılımlar, kendilerini zapt etmek üzere hiç tasarlanmamış ortamlarda çoğalıp uyum sağlayabilir.

2026 araştırmasının değeri, ürkütücü bir manşet olmasından çok erken gelen bir uyarı olmasında. Küçük modellere dayalı kopyalayıcıların yayılması hâlâ günler sürüyor; yani zamanımız var. Ama yeterince kısıtlanmamış milyarlarca cihaz evlere, fabrikalara ve şehirlere yerleştiğinde, sınırları sonradan eklemek yavaş ve pahalı olacak. Yerel yapay zekâ çağının standartları şu anda yazılıyor.

Hangi yöne gideceğimizi bilmek için her teknik ayrıntıyı çözmüş olmamız gerekmiyor. Yerel zekâyı ihtiyaca göre boyutlandırın. Devreye alınan modelleri değiştirilemez kılın. Her göreve yalnızca ihtiyaç duyduğu veriyi ve yetkiyi verin. Her ajana kullandığı işlem gücünün bedelini ödetin ve vakti gelince sona ermesini sağlayın. İşe yarayan kapatma düğmeleri kurun. Akıl yürütmeyi yetkiden ayrı tutun.

Uygarlığın dayandığı sistemlerin kontrolünü kaptırmadan, bir milyar yerel yapay zekâlı bir dünyaya kucak açmanın yolu belki de budur.
