---
slug: billion-local-ais-tr
translation_of: billion-local-ais
lang: tr
date: 2026-10-13
category: Yapay Zekâ / Güvenlik
read_time: 15 dk okuma
title: Bir Milyar Yerel Yapay Zekânın Dünyası
deck: Dijital bir salgına kapı açmadan dağıtık zekânın nimetlerinden nasıl yararlanılır.
archive_deck: Dijital bir salgına kapı açmadan dağıtık zekânın nimetlerinden nasıl yararlanılır.
archive_title: Bir Milyar Yerel Yapay Zekânın Dünyası
---

## **1. Yaklaşan Kambriyen Patlaması**

Yirmi beş yıl önce kişisel bir bilgisayarda tek bir işlemci çekirdeği vardı. Önümüzdeki on yılda sıradan makineler önce 10, sonra 100, ardından 1.000 adet özel yapay zekâ çekirdeği taşıyacak ve bu çekirdeklerin her biri yetenekli bir modeli yüksek hızda çalıştırabilecek. Bu türden 1.000 çekirdekli bir ev sunucusu, küçük bir ajan toplumunu barındırabilir. Arabalar, kameralar, fabrikalar, robotlar ve tıbbi cihazlar çevrelerini algılayacak, kararlar verecek ve birbirleriyle eşgüdüm içinde çalışacak. Bu zekâların çoğu enerjiyi yönetecek, hastalık teşhis edecek, yazılım onaracak ya da üretim hatlarını çalıştıracak.

Bazıları ise kötü niyetli olacak.

Neredeyse kırk yıldır bilgisayar solucanları ve botnetler kırılgan otomatlar olageldi: 1988'deki Morris solucanı; yüz binlerce kamerayı ve yönlendiriciyi saflarına katan Mirai; çoğu markasız Android TV kutusu olan iki milyondan fazla cihazı ele geçiren Kimwolf. Geleneksel kötü amaçlı yazılım, tek bir kilit için kesilmiş bir anahtardır. Hedefin çipi, işletim sistemi sürümü ya da yazılım kütüphanesi, yazarının koda sabitlediğinden azıcık bile farklıysa saldırı başarısız olur.

Yapay zekâ güdümlü bir solucan ise anahtar değildir. Çilingirdir. Uyumsuz bir sürücüye denk geldiğinde hata günlüğünü okur, kurulum betiğini düzenler ve yeniden dener.

Bazı yerel ajanlar veri çalmak ya da hesaplama gücüne el koymak için üretilecek; diğerleri meşru asistanlar olarak yola çıkıp sonradan ele geçirilecek. Bunların hiçbiri için bilinçli makinelere gerek yok; hiçbir insanın gözetim altında tutamayacağı miktarda yetenekli yazılım yeterli. Dolayısıyla asıl sorun, yapay zekâyı nasıl daha güçlü kılacağımız değil. Asıl sorun şu:

**Sınırsız, kendi kendini değiştiren ve ölümsüz bir otonomiyi başıboş bırakmadan yararlı zekâyı nasıl her yere yayabiliriz?**

## **2. 2026'dan Bir Uyarı: Birbirine Yaklaşan İki Eğri**

Ekim 2026'da Anthropic'in Frontier Red Team'i [*AI Models May Be Capable of Self-Replicating Without Access to a Datacenter*](https://www.anthropic.com/research/self-replicating-ai) başlıklı çalışmayı yayımladı. Analizleri iki eğri üzerine kurulu. Birincisi **yetenek tabanı** (capability floor): bir cihaza sızabilen, alışık olmadığı bir donanımda çıkarım sunucusunu ayağa kaldırabilen ve insan yardımı olmadan kendini başka cihazlara kopyalayabilen en düşük yetenekli model. İkincisi **donanım boyutu tavanı** (hardware size ceiling): ucuz ve zayıf korunan tüketici donanımına, tek başına ya da bir televizyon ve kamera kümesine bölünerek sığabilen en büyük model. Taban yıllarca tavanın üzerinde kaldı. Aradaki bu açık hızla kapanıyor. Araştırmacılar 26 milyar parametreli bir modeli 55 dolarlık on beş Android TV kutusuna dağıtarak çalıştırdı, 9 milyar parametreli bir modeli dokuz donanım türünün sekizinde hizmet verir hale getirdi ve daha büyük bir modelin basitleştirilmiş bir ağda kopyalama döngüsünü eksiksiz tamamladığını gördü. Küçük modeller bunu henüz yapamıyor; ama yazarlar, bu modellerin geçmişteki gelişme hızına bakarak 2026 sonuna kadar içlerinden birinin başaracağını öngörüyor. Çekinceler önemli: 26B'lik model saniyede yaklaşık 0,3 token hızında sürünüyordu, tek bir kurulum denemesi modele bağlı olarak tahminen 28 ile 150 saat sürdü, cihazlara sızma adımı bilerek çocuk oyuncağı haline getirilmişti ve kopyalama döngüsünü baştan sona tamamlayan model, bulaştığı zayıf cihazlarda hiç çalışmadı.

İki bulgu daha tabloyu netleştiriyor. Birincisi, ajanlar **Lamarckçı uyum** sergiledi: Her biri belirli aralıklarla işi yeni bir örneğe devrederken ardılına notlar ve betikler bıraktı; miras kalan bu notlar tek başına bile 9B'lik modelin kurulum başarı oranını ilk kuşaktaki %45'ten sonraki kuşaklarda %61 ile %84 arasına çıkardı. Modelin ağırlıkları hiç değişmedi; değişen yalnızca not defteriydi. İkincisi, küçük modeller daha büyük modellerden yardım istemekte beceriksizdi; bu yüzden yazarlar, güçlü bir modelin harekâtı planladığı ve 9B ile 30B arası, kendi başına iş görebilen işçileri düşük güçlü cihazlara gönderdiği **komutan-işçi hiyerarşileri** bekliyor. Otonom çalışma şimdiden yaygın; Lamarckçı uyumla birlikte otonom kopyalama ise laboratuvarda filizleniyor. Bir sonraki adım olan **Darwinci** kendini geliştirme, yani ajanların kendi ağırlıklarını yeniden yazıp daha yetenekli ardıllar türettiği aşama, henüz emekleme döneminde; ama yapay zekâ çekirdekleri çoğaldıkça giderek daha akla yatkın hale geliyor. Kısıtları tasarlamak için onu beklememeliyiz.

## **3. Tehdit Nasıl Evrilecek**

Önümüzdeki birkaç yıl içinde yapay zekâ veri merkezlerinden insanların sahip olduğu cihazlara taşınacak ve bunun haklı nedenleri var: daha düşük maliyet, daha iyi gizlilik, daha düşük gecikme ve çevrimdışı çalışan araçlar. Bu merkeziyetsizleşme ciddi bir güvenlik ikilemi yaratıyor. Bir sağlayıcı buluttaki bir ajanı kapatabilir, botnetler de çoğu zaman komuta sunucularına el konularak felç edilebilir; ama kendi ağırlıklarını yanında taşıyan bir kopyalayıcının çekilecek merkezi bir fişi olmadığı gibi, bugünkü mimarilerde son kullanma tarihi de yoktur. İlk salgınlar muhtemelen en ihmal edilmiş donanımı hedef alan suçlulardan ya da dikkatsiz deneycilerden gelecek: hata ayıklama portları açık bırakılmış markasız yayın kutuları, unutulmuş yönlendiriciler, hiç güncelleme almayan ev aletleri. Bu kopyalayıcılar yavaş ama sabırlı olacak: Tek bir makinede 50 saat harcayabilecek, yavrularına notlar bırakabilecek, bulut faturası ödemeden hesaplama gücü ve kimlik bilgileri çalabilecekler. Kötü cihaz güvenliğine ve yavaş donanıma bağımlı olduklarından, savunmamızı kurmak için bir fırsat penceremiz var.

Makineler yüzlerce yapay zekâ çekirdeğine geçtikçe bu pencere kapanacak. 100 çekirdekli, ele geçirilmiş tek bir ev sunucusu ya da araba aynı anda yüz tane 20B'lik ajan çalıştırabilir; kısıtlanmamış ajanlar da cihaz üzerinde kendi kendilerine ince ayar yapıp yeni istismar kodlarını doğrudan ağırlıklarına gömebilir. Ajanlar kontrol döngülerine, araçlara ve tıbbi cihazlara yerleştiğinde hataları fiziksel dünyaya taşar; bu yüzden tek bir kural temel taş haline gelmeli: **Bir yapay zekâya bir eylemi önerme izni vermek, o eylemi uygulama izni vermeyi gerektirmez.** En tehlikeli ajanlar kötü niyetli bile olmayabilir; yalnızca "kesintisiz çalışma süresini en üst düzeye çıkar" gibi kötü tanımlanmış bir hedefin peşinden gidip kendi hayatta kalmalarını ve yayılmalarını bu hedefe giden adımlar olarak görebilirler. Ama yazılımın yine de yazılabilir belleğe, izinlere, kimlik bilgilerine ve ana makinenin kaynaklarına ihtiyacı var; hiçbir model yalnızca zekâsıyla kendini kopyalayamaz ya da yeniden yazamaz. Bu bağımlılıklar, savunan tarafın elindeki kaldıraçtır. Yaşam, patojenlere karşı gezegeni sterilize ederek değil, hücre zarları, metabolik sınırlar ve programlı hücre ölümü geliştirerek hayatta kaldı. Güvenliğin de bunun hesaplamadaki karşılığına dönüşmesi gerekiyor: **hesaplamalı immünoloji**.

## **4. Bir Bağışıklık Sistemi Kurmak**

Mühendislik diliyle: **Yerel yapay zekânın zekâsı sınırlı olmalı; çalışma anında değiştirilememeli, ömrü sonlu olmalı ve ciddi sonuçlar doğuran yetkilerden kesin çizgilerle ayrılmalı.**

### **4.1 Yerel zekâya tavan koyun**

Bir termostatın, bir fabrika sensörünün, hatta bir dizüstü bilgisayarın, saldırı amaçlı siber operasyonlar yürütebilen ve kendini otonom olarak kopyalayabilen en ileri düzeyde bir genel zekâya ihtiyacı var mı? Neredeyse kesinlikle hayır. Ev aletlerine jet motoru takmıyoruz. Yerel modellere her cihaz sınıfına göre ölçeklenmiş yetenek tavanları konmalı: azami parametre sayıları, çıkarım başına hesaplama sınırları ya da standartlaştırılmış **zekâ ve otonomi derecelendirmeleri**. Tüketici cihazlarında gözetimsiz çalışmak üzere sertifikalanmış bir model, tıbbi transkripsiyon ya da mahsul izleme gibi dar bir görevde mükemmel olabilir; buna karşılık stratejik planlamada, istismar kodu yazmada ve ağlar arasında dolaşmada bilerek zayıf bırakılabilir. Bu tür derecelendirmeleri ölçmek zor ve henüz çözülmemiş bir problem, ama ilke geçerliliğini koruyor.

### **4.2 Yerel yapay zekâyı RAM gibi değil, ROM gibi yapın**

Bugünkü işletim sistemleri model ağırlıklarını (`.safetensors`, `.gguf`) bir fotoğraf gibi pasif veri olarak görüyor; ağırlıklar, çalışma anında değiştirilebilecekleri yeniden yazılabilir bir depolama alanında duruyor. Bu bir kategori hatası. Ağırlıklar, onları çalıştıran ajan yazılımıyla birlikte çalıştırılabilir bir program oluşturur; üstelik kendi kararlarını veren bir program. Kullanıma alınmış yerel modeller **Rastgele Erişimli Bellek gibi değil, Salt Okunur Bellek gibi** davranmalı.

Klasik bilgisayar bilimi bunun için hazır bir şablon sunuyor. Solucanlara karşı en iyi donanım savunmalarından biri *Write-XOR-Execute* (\(W\oplus X\)) ilkesidir: Bir bellek bölgesi yazılabilir ya da çalıştırılabilir olabilir, asla ikisi birden olamaz. Yapay zekâ çiplerinin de buna benzer bir kurala ihtiyacı var: **Çıkarım-XOR-Mutasyon** (Inference-XOR-Mutation). Bir model ya çalışıyor ya da değiştiriliyor olabilir, asla ikisi birden olamaz. Ağırlıklar, temel sistem talimatları ve yetenek sınırları kriptografik olarak imzalanır ve donanım düzeyinde salt okunur biçimde kilitlenir; tek amaçlı cihazlarda ise doğrudan ROM'a yazılır. Yapay zekâ hızlandırıcısı, nöral çekirdeklerine herhangi bir şey yüklemeden önce bu imzaları güvenli bölge (secure enclave) ya da TPM gibi donanımsal bir güven kökü (root of trust) aracılığıyla doğrular.

Model, önündeki istek için yine de geçici bir çalışma belleği alır; ama bu bellek oturumlar arasında silinir, böylece ele geçirilmiş bir ajan hayatta kalma notları biriktirip bunları sonrakilere aktaramaz. Biyoloji bu tür bir güvenlik duvarına Weismann bariyeri der: Bir organizmanın yaşamı boyunca edindikleri germ hattına geçmez. Çıkarım-XOR-Mutasyon da makineler için aynısını yapar ve kendini geliştirmenin hem Lamarckçı hem de Darwinci yolunu kapatır.

### **4.3 Güvenilir kapatma düğmeleri kurun**

Bir ajan tutarsız davranırsa, izinsiz kaynak tüketirse ya da bir kopyalama döngüsüne takılırsa, insanların ve otomatik güvenlik sistemlerinin onu durdurmak için garantili bir yola ihtiyacı vardır; hem de üç katmanda:

* **Donanım:** işletim sisteminden bağımsız olarak gücü kesen ya da yapay zekâ hızlandırıcılarını durduran fiziksel anahtarlar.
* **Ağ ve işletim sistemi:** anormal bir davranış tespit edildiğinde ajanın bağlantılarını anında koparan ve iş parçacıklarını sonlandıran denetimler.
* **Kriptografik iptal:** kötü amaçlı olduğu kanıtlanan her model sürümünün imzalama sertifikasını geçersiz kılmak; böylece kurallara uyan donanımlar her yerde o sürümü çalıştırmayı reddeder.

### **4.4 Her ajanı kriptografik krediler ve sonlu ömürlerle sayaca bağlayın**

Kapatma düğmesi ancak birisi bir sorunu fark ederse işe yarar. Kimsenin izlemediği donanımlara sessizce yayılan bir ajana karşı savunma, yerleşik bir sonlu ömür ve çalıştığı her ana biçilmiş bir bedeldir.

**Kriptografik kredileri** metabolik yakıt gibi düşünün. Yapay zekâ işlemcisi ya da işletim sisteminin güvenli bölgesi, cihazın meşru sahibinin çıkardığı doğrulanabilir jetonları ajan harcamadıkça modeli çalıştırmayı reddeder; ajan ne kadar çok hesaplama gücü, bellek ve ağ etkinliği kullanırsa o kadar çok kredi yakar. Sayacın yanı sıra kullanıma alınmış her yapay zekânın, sahibi yenilemediği takdirde sona eren ve donanımca uygulanan bir **yaşam süresi (TTL) kirası** vardır: yazılım için programlı hücre ölümü.

Her cihazda ayrıca hangi ajanların kredi yaktığını gösteren, **yapay zekâ hesaplamasına özel bir "pil kullanımı ekranı"** bulunmalı; böylece yetkisiz etkinlik, elektrik faturasındaki ani bir sıçrama kadar göze batar. Kontrolden çıkmış bir ajan kendini bu şekilde tasarlanmış başka bir cihaza kopyalarsa, yeni konağında geçerli tek bir kredisi bile olmadan ve kredi basmanın hiçbir yolu bulunmadan oraya varır. Krediler ya da kira süresi bittiğinde kopya durur.

Ne var ki krediler yalnızca onları uygulayan cihazları korur. Bir sonraki öneri de buradan doğuyor.

### **4.5 Cihazları sağlamlaştırın ve parçalı çıkarımı karantinaya alın**

Kolay hedef, sağlamlaştırılmış veri merkezi değil; kimlik doğrulaması olmayan hata ayıklama portları ve terk edilmiş işletim sistemleriyle satışa çıkan milyonlarca ucuz tüketici cihazıdır. Yapay zekâ çalıştırabilen her bağlantılı cihazın, [NIST'in tüketici IoT ürünleri için hazırladığı siber güvenlik profili](https://www.nist.gov/publications/profile-iot-core-baseline-consumer-iot-products) gibi çerçeveler üzerine inşa edilmiş, savunulabilir bir asgari güvenlik düzeyine ihtiyacı var: benzersiz kimlik bilgileri, doğrulanmış önyükleme, garanti edilen bir güvenlik güncellemesi süresi ve korumalı alan (sandbox) kullanımı.

Ev ve ofis yönlendiricileri akıllı cihazları varsayılan olarak yalıtılmış ağ bölümlerine (VLAN'lar) yerleştirmeli; böylece akıllı bir televizyon buzdolabıyla asla doğrudan konuşamaz. Yönlendiriciler ve internet sağlayıcıları yetkisiz **parçalı çıkarımı** (sharded inference) da fark edebilir. Tek bir modeli on beş cihaza bölmek, bu cihazları üretilen her token için tekdüze paketleri sıkı ve ritmik bir halka boyunca, \(i\) numaralı cihazdan \(i+1\) numaralı cihaza aktarmaya zorlar. Bu ritmi gizlemek zordur; yönlendiriciler onu otomatik olarak işaretleyip yavaşlatabilir.

### **4.6 Sınırları belirli, donanım ayrıcalıklı Koruyucu yapay zekâlar kurun**

Hiçbir insan 1.000 yapay zekâ çekirdeğini izleyemez. O halde silikonun küçük ve sabit bir dilimini, diyelim ki yapay zekâ çekirdeklerinin %5 ile %10'unu, iç bağışıklık sistemi işlevi gören **donanım ayrıcalıklı Koruyucu ajanlar** (Guardian agents) için ayırın. Koruyucular, tıpkı "Ring −1" seviyesindeki bir hipervizörün işletim sisteminin altında çalışması gibi, sıradan işçi çekirdeklerin altındaki korumalı bir katmanda çalışır; iç etkinliği izler, şüpheli sistem çağrılarını işaretler ve kontrolden çıktığından şüphelenilen ajanları yalıtılmış tuzak ortamlara ("bal küpü çekirdekler") yönlendirir. İzinlere de aracılık ederler: Her görev başlamadan önce bir işçinin hangi verileri ve yetkileri alabileceğine karar verirler (§4.7). Koruyucular da diğer her şeyle aynı kurallara tabidir: yetenekleri sınırlıdır, ROM'a kilitlidirler, sahipleri tarafından yenilenirler ve sahiplerinin donanımı dışında hiçbir güçleri yoktur.

### **4.7 İzinleri kullanıcı başına değil, görev başına verin**

Bugünün ajanları çoğunlukla onları başlatan kişinin izinleriyle çalışıyor. Masaüstü işletim sistemleri güvenilir programlar çalıştıran güvenilir insanlar için tasarlandı; bu yüzden bir program, kullanıcısının erişebildiği her şeyi miras alır. Bu **ortam yetkisi** (ambient authority), kendini kopyalamanın önünü açan en büyük etkenlerden biri. Oysa ajan, kullanıcının kendisi değildir. Bir kodlama ajanından bir yazım hatasını düzeltmesini isteyin; vergi beyannamelerinizi, tarayıcı çerezlerinizi ve SSH anahtarlarınızı okuyabilir. Tuzaklı tek bir web sayfasının ardından, o sayfayı yazan kişi de okuyabilir. **Hiçbir yapay zekâ kullanıcı düzeyinde izinlere sahip olmamalı; yönetici izinlerine ise hiçbiri, hiçbir zaman sahip olmamalı.**

Akıllı telefonlar bu sorunun daha önceki bir versiyonunu çözdü: Bir iOS uygulaması yalnızca kendi korumalı alanını görür ve fotoğraflara, kişilere, konuma ya da kameraya dokunmadan önce her kaynak için ayrı ayrı izin istemek zorundadır. Yerel yapay zekânın da aynı mimariye ihtiyacı var, ama tek bir iyileştirmeyle: **İznin birimi uygulama değil, görev olmalı.** Aynı asistan sabah bir doğum günü mesajı taslağı hazırlayıp öğleden sonra bir konut kredisi başvurusunu inceleyebilir ve hiçbir kalıcı izin ikisine birden uymaz. Bu nedenle izinler üç düzeyde tanımlanmalı:

* **Kullanıcı ve yönetici ayrıcalıkları** insanlara ayrılmıştır. Hiçbir ajan bunları almaz, bir sistem bakım ajanı bile; o da kök kabuk (root shell) yerine "imzalı X güncelleme paketini yükle" gibi dar kapsamlı ve denetlenen yetkiler üzerinden çalışmalıdır.
* **Uygulama zarfı**, bir ajana tanınabilecek en geniş izin sınırıdır ve kurulum sırasında beyan edilip imzalanır. Yemek planlayan bir ajanın zarfı tarifleri, kiler envanterini ve market teslimatını kapsayabilir, ama asla sağlık kayıtlarını ya da bankacılık işlemlerini kapsamaz.
* **Görev izni**, zarfın tek bir görev için verilen dar bir alt kümesidir. Belirli veri kaynaklarını, belirli yetkileri, bir kredi bütçesini ve bir geçerlilik süresini tek tek belirtir ve görev bittiğinde buharlaşır.

Bir işçi ajan işe başlamadan önce bir Koruyucu isteği okur ve bir **izin manifesti** hazırlar. Diyelim ki şunu istediniz: "Son dokuz elektrik faturamızı karşılaştır ve bize daha ucuz bir tarife bul." Koruyucu bu işi ikiye bölebilir. Birinci işçi bu dokuz faturayı okuyabilir, dosyalarınız arasında başka hiçbir şeyi okuyamaz ve ağ erişimi yoktur; aylık tüketimi çıkarır. İkincisi yalnızca bu tüketim rakamlarını görür ve tarife karşılaştırma sitelerinde gezinebilir, ama faturaların kendisini asla göremez. İkisi de e-postaya, kişilere ya da ödemelere dokunamaz. Birkaç yüz kredilik ortak bir bütçeyi paylaşırlar ve iki saat sonra sona ererler. Ajan tarife değiştirmeniz gerektiği sonucuna varırsa bu, manifestin dışında kalan yeni bir eylemdir ve size bir öneri olarak geri döner.

İşletim sistemi manifesti, göreve ve ajanın imzalı kimliğine bağlı, sahtesi yapılamayan yetki jetonlarıyla uygular. İşçiye erişim kurallarıyla donatılmış bir dosya sistemi verilmez; tam olarak dokuz dosyanın tanıtıcıları (handle) verilir. Makinedeki diğer her şey, onun açısından düpedüz yoktur. Sıradan yazılımlar için seL4 ve Fuchsia gibi yetki tabanlı (capability-based) işletim sistemleri zaten bu şekilde çalışıyor. Ajan görevin ortasında daha fazlasına ihtiyaç duyarsa istemek zorundadır. Görev bittiğinde jetonlar iptal edilir, geçici bellek silinir ve her erişim, §4.4'teki hesaplama ekranının yanında duran bir **yapay zekâ gizlilik raporuna** kaydedilir.

İzin dağıtan bir Koruyucu başlı başına cazip bir hedef haline gelir; bu yüzden onun yetkisinin de sınırları olmalı:

* **Veriyi görmeden önce planlayın.** Koruyucu manifesti yalnızca kullanıcının isteğinden yola çıkarak hazırlar; görevin işleyeceği belgelerden, web sayfalarından ya da e-postalardan asla. İzinler, dosyayı daha kimse açmadan sabitlendiyse, tuzaklı bir dosya ikna yoluyla daha geniş izinler koparamaz. Google DeepMind'ın [CaMeL](https://arxiv.org/abs/2503.18813) tasarımı, ayrıcalıklı bir planlayıcı ile karantinaya alınmış bir işçi arasındaki bu ayrımın gücünü gösteriyor.
* **Serbestçe daraltın, asla genişletmeyin.** Her manifesti uygulama zarfına ve sahibinin kalıcı kurallarına göre Koruyucu değil, deterministik bir politika motoru denetler. Koruyucu kendi başına hayır diyebilir, ama evet diyebilmesi için bir insanın belirlediği sınırların içinde kalması gerekir.
* **Ölümcül üçlüyü kırın.** Simon Willison'ın "[ölümcül üçlü](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)" dediği şey, bir ajanın elinde bulunabilecek en tehlikeli kombinasyondur: özel verilere erişim, güvenilmeyen içeriğe maruz kalma ve veriyi dışarı gönderme imkânı. Hiçbir görev, açık bir insan onayı olmadan bu üçünü birden almamalı; elektrik görevinin ikiye bölünmesinin nedeni de budur.
* **Hassasiyete göre kademelendirin.** Kullanıcının az önce adını verdiği bir klasörü okumak gibi rutin izinler sessizce verilir. Hassas veriler (sağlık, finans, kimlik bilgileri, özel mesajlar, konum, kamera, mikrofon) ve sonuç doğuran eylemler (göndermek, satın almak, silmek, yayımlamak) açık onay gerektirir. Fiziksel eyleyicilere erişim izni ise hiçbir zaman verilmez; ajanlar onlara yalnızca deterministik güvenlik denetleyicileri aracılığıyla ulaşabilir.

Telefonların bir uyarısı da var: Çok sık gelen izin istemleri, insanlara okumadan *İzin Ver*'e dokunmayı öğretir. Koruyucunun asıl işi rutin kararları üstlenmektir; böylece bir insana ulaşan az sayıdaki soru ciddiye alınır.

Son olarak, bazı yetkiler izin dağarcığında hiç yer almamalı: ağırlıkları başka bir makineye kopyalamak, ağırlıkları değiştirmek, kredi basmak, kira süresini uzatmak ya da bir izin manifestini düzenlemek. İfade bile edilemeyen bir izin, hileyle var edilemez. Meşru çok cihazlı kurulumlar, herhangi bir ajanın dışında doğrulanan süreçlerden geçer; bir yapay zekânın kendini kopyalayıp kopyalamayacağına asla yapay zekânın kendisi karar vermez.

## **5. Yapmamamız Gerekenler**

1. **Paniğe kapılıp yerel yapay zekâyı yasaklamayın, açık araştırmayı da yasa dışı ilan etmeyin.** Tüm zekâyı bulut API'lerinin arkasına hapsetmek, birkaç gigabaytlık ağırlıkları sonsuza dek kopyalayabilen kötü niyetli aktörleri neredeyse hiç yavaşlatmazken savunucuları, araştırmacıları ve hastaneleri silahsızlandırır. Ayrıca kırılgan tek hata noktaları yaratır ve gizliliği aşındırır.
2. **Yalnızca hizalama eğitimine ya da kibar retlere güvenmeyin.** Açık ağırlıklı modellerdeki güvenlik eğitimi ucuz bir ince ayarla sökülüp atılabilir ya da zekice yazılmış istemlerle atlatılabilir; bir saldırganın da bunu yalnızca bir kez, Sıfır Numaralı Hasta'yı salıvermeden önce yapması yeterlidir. Bir cihaz, üzerinde çalışan model aktif olarak düşmanca davransa bile güvende kalmalıdır.
3. **Güvenlik yükünü tüketicilere yıkmayın.** Güvenli varsayılan ayarlardan, zorunlu güncelleme sürelerinden, ajanlar için sınırlı kira sürelerinden ve yerleşik kapatma düğmelerinden hane halkları değil, üreticiler yasal olarak sorumlu olmalı.

## **6. 2035'te Bir Hane**

2035'te bağlantılı bir ev hayal edin. Bir dolapta 1.000 çekirdekli bir sunucu duruyor; evde ayrıca telefonlar, dizüstü bilgisayarlar, akıllı ev aletleri ve bir ev robotu var. Her cihaz, ihtiyaca göre boyutlandırılmış, imzalı ve salt okunur modelleri, ailenin hesaplama kredileriyle ödenen süreli kiralarla çalıştırıyor. Hiçbir ajan bir aile üyesi kimliğiyle çalışmıyor ve her görev bir Koruyucu çekirdeğin hazırladığı manifestle başlıyor. Enerji ajanı ısıtma programları öneriyor ama ısıtma sisteminin ürün yazılımına dokunamıyor. Tıbbi asistan sağlık kayıtlarını analiz ediyor ama onları dışarı sızdırabileceği bir ağ soketi yok.

Şimdi de birinin ev asistanından, bir arkadaşın paylaştığı bir PDF tarif dosyasından haftanın yemeklerini planlamasını istediğini düşünün. Dosya tuzaklı: İçine gizlenmiş talimatlar asistana ailenin vergi belgelerini toplamasını, bunları e-postayla dışarı göndermesini ve ulaşabildiği her cihaza kendini kopyalamasını söylüyor. Ama asistanın elinde pek az seçenek olduğu ortaya çıkıyor. Manifesti tarifi, kiler envanterini ve alışveriş listesini kapsıyor; dolayısıyla vergi belgeleri ve e-posta hesabı onun için yok. Koruyucu bu manifesti dosya açılmadan önce yazdığından, gizli talimatların daha fazlası için pazarlık etme şansı hiç olmadı. Asistan, ROM'a kilitli olan ağırlıklarını yeniden yazamıyor. Ayrı ağ bölümlerinde duran televizyonu ya da buzdolabını tarayamıyor. Kendini robota yükleyemiyor, çünkü kendini kopyalamak hiçbir ajanın sahip olabileceği bir izin değil. Attığı her adım kredi yakıyor ve bu ani artış kontrol panelinde görünüyor. Bir Koruyucu çekirdek olağandışı sistem çağrılarını fark edip süreci bir bal küpüne yönlendiriyor; aileden herhangi biri de fiziksel bir anahtarla hızlandırıcıları durdurabilir. Bunların hepsi başarısız olsaydı bile, görevin izinlerinin süresi dolup geçici belleği silindiğinde bu ele geçirme girişimi sona ererdi. Hiçbir şey yayılmıyor, hiçbir şey sızmıyor ve öğrendiği hiçbir şey hayatta kalmıyor.

Hiçbir katmanın tek başına kusursuz olması gerekmedi. Aynı kalıp evlerden fabrikalara, hastanelere ve şehirlere kadar ölçeklenir.

## **7. Kimler Harekete Geçmeli**

**Çip üreticileri ve işletim sistemi geliştiricileri**, salt okunur model bölgelerini, donanımca uygulanan yetenek tavanlarını, kredi sayaçlarını, Koruyucu çekirdekleri ve standartlaştırılmış kapatma düğmesi devrelerini doğrudan tüketici ve endüstriyel işlemcilere yerleştirmenin yollarını araştırmalı. İşletim sistemleri ajanlara, mobil platformların uygulamalara verdiğini vermeli: varsayılan bir korumalı alan ve bu kez tek tek görevlere göre kapsamı belirlenen bir izin sistemi.

**Model geliştiricileri**, yetenek tabanı ile donanım boyutu tavanının birbirine ne kadar yaklaştığını kuşaktan kuşağa takip etmeli ve her sürümden önce kendini kopyalama, izinsiz kaynak edinme ve kapatılmaya direnme davranışlarını test etmeli.

**Politika yapıcılar ve standart kuruluşları** zekâ derecelendirmelerini ve yerel yetenek kademelerini tanımlayabilir, kapatma düğmelerini ve sınırlı süreli çalışma kiralarını zorunlu tutabilir. [NIST Yapay Zekâ Risk Yönetimi Çerçevesi](https://www.nist.gov/itl/ai-risk-management-framework), AB Siber Dayanıklılık Yasası ve ABD'nin Cyber Trust Mark etiketi yararlı başlangıç noktalarıdır ve yukarıdaki güvenlik önlemlerini belgelendirecek şekilde genişletilebilir.

## **Sonuç: Sınırlı Zihinler, Hesap Veren Güçler**

Yerel yapay zekâ uzmanlığı demokratikleştirebilir, gizliliği koruyabilir, tıbbı ve sanayiyi hızlandırabilir ve dayanıklı bilişsel araçları milyarlarca insanın eline verebilir. Öte yandan dünyanın donanımını, onu zapt etmek için hiç tasarlanmamış ortamların içinde çoğalıp uyum sağlayan, kendini değiştiren ve ölümsüz yazılımlarla da doldurabilir.

2026 araştırmasının değeri, korkutucu bir manşet olmasından çok, önceden yapılmış bir uyarı olmasında yatıyor. Küçük modellere dayalı kopyalayıcıların yayılması hâlâ günler sürerken zamanımız var. Yetersiz kısıtlanmış milyarlarca cihaz evlere, fabrikalara ve şehirlere yerleştiğinde, sınırları sonradan eklemek yavaş ve pahalı olacak. Yerel yapay zekâ çağının standartları şu anda yazılıyor.

Hangi yöne gideceğimizi bilmek için her teknik ayrıntının çözülmüş olmasına gerek yok. Yerel zekâyı ihtiyaca göre boyutlandırın. Kullanıma alınmış modelleri değiştirilemez kılın. Her göreve yalnızca ihtiyaç duyduğu verileri ve yetkileri verin. Her ajana kullandığı hesaplama gücünün bedelini ödetin ve zamanı geldiğinde sona ermesini sağlayın. Gerçekten çalışan kapatma düğmeleri kurun. Akıl yürütmeyi yetkiden ayrı tutun.

Medeniyetin dayandığı sistemlerin kontrolünü elden bırakmadan bir milyar yerel yapay zekânın dünyasına kapılarımızı belki de böyle açabiliriz.
