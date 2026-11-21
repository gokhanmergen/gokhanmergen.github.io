---
slug: low-hanging-superintelligence-tr
translation_of: low-hanging-superintelligence
lang: tr
date: 2026-11-19
category: Gelecek / Yapay Zekâ
read_time: 5 dk okuma
title: Süper Zekânın Kolay Lokmaları
deck: Yapay Zekâ Kodun ve Matematiğin Dışında Tavana Dayanabilir mi?
archive_deck: Yapay Zekâ Kodun ve Matematiğin Dışında Tavana Dayanabilir mi?
---

Uzun süre yapay zekânın bir gün doygunluğa ulaşabileceği hiç aklıma gelmedi. Eğri o kadar dik, atılımlar o kadar amansız, tavan da o kadar gözden uzaktı ki bir duraklama ihtimalini ciddiye almak zordu.

Son zamanlarda ise durup bu varsayımı sorgulamaya başladım. Bunu yapay zekâ gelişmeyi bıraktığı için yapmıyorum; belli ki bırakmadı. Bugünkü en çarpıcı kazanımların *nereden* geldiğini ve dünyanın geri kalanına ne kadar sorunsuz taşınabildiğini sormaya değer olduğu için yapıyorum.

Beni duraksatan düşünce basit: Matematik ve kodlama, yani yapay zekânın şu an en mucizevi göründüğü alanlar, belki de işin en kolay lokması.

## İki Sihirli Bileşen: Veri ve Doğrulanabilirlik

Modern yapay zekâ için ideal bir oyun alanı tasarlamak isteseydiniz iki şey arardınız: uçsuz bucaksız bir eğitim verisi okyanusu ve bir cevabın doğru olup olmadığını zahmetsizce, nesnel biçimde kontrol etmenin bir yolu.

Yazının elinde veri vardı. Matematikle kodlamada ise doğrulanabilirlik var; kodlama buna bir de devasa bir gerçek dünya verisi yığını ekliyor.

Matematik, elimizdeki belki de en net kavram kanıtı. Süper zekâya anlamlı biçimlerde şimdiden ulaşılmış bir alan bu: Modeller olimpiyat düzeyindeki akıl yürütmeyi ve biçimsel teorem ispatını artık rutin olarak hallediyor. Oraya da neredeyse kesinlikle doğrulanabilir geri bildirimle pekiştirmeli öğrenme (RLVF) sayesinde vardılar. Matematik mümkün olan en temiz ödül sinyalini sunar: İster tartışmaya yer bırakmayan nihai cevaplarla ister biçimsel ispat denetleyicileriyle olsun, bir türetme nesnel olarak ya doğrudur ya yanlış. Kendi akıl yürütme adımlarını büyük ölçekte doğrulayabilen bir sistem matematiği ezberlemekle kalmaz; arayabilir, yineleyebilir ve kendi kendini yukarı çekerek insanın tavanını aşabilir.

Yazılım mühendisliği de hemen yanı başında duruyor ve makine öğrenmesine eşsiz derecede elverişli. Onlarca yıllık açık kaynak depoları, dokümantasyon, hata takip sistemleri ve forum başlıkları, modellere öğrenmek için olağanüstü bir temel sağladı. Daha da iyisi, kod kapalı ve deterministik bir döngünün içinde yaşar. Yapay zekâ bir fonksiyon yazdığında, fonksiyonun ne kadar iyi olduğunu altı ay tartışacak bir uzman heyetine ihtiyacınız yoktur. Derleyiciyi çalıştırırsınız. Test paketini çalıştırırsınız. Kod ya geçer ya kalır.

Bu sıkı geri bildirim döngüsü RLVF için roket yakıtı. Bir modele matematik problemi ya da kodlama görevi verin, bin farklı yaklaşım denemesine izin verin, doğrulamadan geçenleri ödüllendirin ve bunu devasa ölçekte tekrarlayın. Bu koşullarda insanüstü performans yalnızca mümkün değil, neredeyse beklenen sonuç.

Bilgisayar kullanımı da aşağı yukarı aynı yerde duruyor. İşletim sisteminde gezinmek, düğmelere tıklamak, veritabanlarını sorgulamak, dijital iş akışlarını tamamlamak: Bunların hepsi durumların gözlemlenebildiği, sonuçların da çoğu zaman otomatik olarak kontrol edilebildiği yapılandırılmış ortamlarda olup biter.

Yapay zekânın ileri matematiği fethettiğini, yazılım benchmark'larını silip süpürdüğünü ve dijital görevleri otomatikleştirdiğini izlerken, her alanın böyle işlediğini varsaymak cazip geliyor.

Ama ekranın ve ispat denetleyicisinin dışına adım attığınızda arazi bambaşka görünür.

## Doğrulayıcının Bittiği Yer

Yazı, matematik, kodlama ve genel bilgisayar kullanımından sonra, aynı anda bu kadar veri zengini ve bu kadar doğrulanabilir *başka* bir alan var mı?

Fiziği düşünün. Fiziğin sınırlarındaki gerçek ilerlemenin önünü tıkayan şey sözdizimi ya da salt sembolik işlem değil, gerçekliğin kendisi. Temiz RLVF ödül sinyalleri üretmek için bir gecede on milyon sentetik parçacık çarpıştırıcısı kuramazsınız. Deneyler pahalı, yavaş ve gürültülüdür; üstelik hâlâ keşfetmeye çalıştığımız fizik yasalarıyla sınırlıdır.

Fiziksel mühendisliği düşünün. Bir köprü, bir jet türbini ya da yeni bir batarya kimyası tasarlamak, işin içine malzeme bilimini, üretim toleranslarını, onlarca yıl boyunca biriken aşınmayı ve ancak karmakarışık gerçek dünyada ortaya çıkan uç durumları katar. Simülasyonlar elbette yardımcı olur, ama simülasyon dediğiniz bir yaklaşıklıktan ibarettir. Eninde sonunda test paketi gerçekliğin kendisidir ve gerçeklik insanı çileden çıkaracak kadar yavaş çalışır.

Doktorluğu düşünün. Tıp bilgi selinde boğuluyor ama, paradoks gibi görünse de, temiz ve doğrulanabilir geri bildirime hasret. Hasta geçmişleri parça parça, mahremiyetle korunuyor ve söze dökülmemiş bağlamla dolu. Aynı belirtileri gösteren iki hasta aynı tedaviye bambaşka tepkiler verebilir. Klinik bir karar en doğru karar olduğu için mi işe yaradı, yoksa hasta şanslı olduğu için mi? Bazen bunu yıllarca bilemezsiniz. Bir ödül fonksiyonunu optimize etsin diye yapay zekânın insan hayatları üzerinde bir milyon deneme yanılma turu atmasına ise asla izin veremezsiniz.

Bu alanların hepsinde geri bildirim döngüsü yavaş, pahalı, belirsiz ya da etik açıdan kısıtlı. Bir ispat denetleyicisiyle ya da birim testiyle hakikate kaba kuvvetle ulaşamazsınız.

## İki Mekanizmanın Hikâyesi

Buradan, önümüzdeki yol hakkında ne kadar emin olabileceğimiz konusunda önemli bir asimetri doğuyor.

Veri zengini ve doğrulanabilir alanlarda süper zekâ ya çoktan geldi ya da neredeyse kaçınılmaz görünüyor. Matematik bu eşiği çoktan aştı; muhtemelen aynı RLVF motoruyla. Yazılım geliştirme, dijital işler ve metne dayalı bilgi işlerinin büyük bölümü de doğrulanabilir geri bildirimin ve sentetik veri üretiminin tam nişangâhında duruyor. Bu alanlarda ustalığa giden yol belli ve şimdiden kat ediliyor.

Dünyanın geri kalanında ise mekanizmaya dayanan doğrudan argümanı bu kadar net kurmak daha zor. Bol ve sinyali güçlü veri ile ucuz doğrulama olmadan modeller aynı RLVF çarkına öylece yaslanamaz, çünkü fiziksel dünya onların ödevlerini yeterince hızlı notlandırmaya yanaşmıyor.

## Her Alanda Süper Zekâ Neden Hâlâ Temel Senaryo?

Bu çekinceye rağmen, yapay zekânın ölçeklenmesine *karşı* bahse girmek tarihsel olarak kaybettiren bir oyun oldu.

Ham hesaplama gücünden doğan zekâ amansızca ve katlanarak artıyor; bu artış, Moore Yasası'nın günümüzdeki mirasçısı. Bunu hesaba katınca *her* alanda süper zekâ hâlâ temel senaryo gibi duruyor. Ham ölçek, insanların özel veri ya da elle kurulmuş geri bildirim döngüleri gerektirdiğini sandığı boşlukları defalarca, kendiliğinden ortaya çıkan yeteneklerle kapattı.

Matematik, kod ve yapılandırılmış akıl yürütmede insanüstü düzeye kadar eğitilmiş, arkasında mertebelerce fazla hesaplama gücü bulunan bir yapay zekânın, alana özgü eğitim verisine ve RLVF'ye ihtiyacı aşan derin ve genellenebilir bir zekâ geliştirdiğini hayal etmek zor değil. Akıl yürütmesini bir disiplinde bileyip sonra o zekâyı yabancı, verisi kıt bir probleme yönelten parlak bir bilim insanı gibi, salt ölçek de fizikte, mühendislikte ve tıpta gerçek anlamda az örnekle genellemenin kilidini açabilir.

Bu açıdan bakınca alternatif, yani yapay zekânın gerçek dünyadaki alanlarda zengin veri ve temiz, doğrulanabilir geri bildirim bulunmadığı için ekranın dışında yavaşlaması ya da bir tavana çarpması, daha şaşırtıcı sonuç olurdu.

Yine de matematiğin ve kodlamanın ne kadar ayrıcalıklı olduğunu fark etmek, bu şaşırtıcı alternatifi ilk kez ciddiye almaya değer kılmaya yetiyor. Ham hesaplama gücü süper zekâyı fiziksel gerçekliğin her karmakarışık köşesine pürüzsüzce taşıyacak mı, yoksa doğrulayıcıların yokluğu sonunda gerçek bir sürtünme mi yaratacak?

Bunu zaman gösterecek.
