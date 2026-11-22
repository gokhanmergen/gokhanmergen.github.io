---
slug: grh-reader-guide-tr
translation_of: grh-reader-guide
lang: tr
date: 2026-11-20
time: 22:00
category: Matematik / Yapay Zekâ
read_time: 2 dk okuma + 43 sayfalık rehber
title: Genelleştirilmiş Riemann Hipotezi'nin Lean 4 İspatının İçinden: Bir Okuma Rehberi
archive_title: GRH'nin Lean İspatına Bir Okuma Rehberi
deck: Levent Alpöge ve Claude, Riemann Hipotezi'nin makineyle denetlenebilir bir ispatını yayımladı, ama okunacak bir makale yok. Ben de bir yapay zekâdan kodu okuyup anlatmasını istedim.
archive_deck: Levent Alpöge ve Claude, Riemann Hipotezi'nin makineyle denetlenebilir bir ispatını yayımladı, ama okunacak bir makale yok. Ben de bir yapay zekâdan kodu okuyup anlatmasını istedim.
---

Bugün Anthropic'te çalışan matematikçi [Levent Alpöge](https://alpo.ge/), Kasım 2026'da Claude'la birlikte Riemann Hipotezi'nin bir ispatını bulduğunu duyurdu. Ona göre aynı yöntem, Dirichlet L-fonksiyonları için Genelleştirilmiş Riemann Hipotezi'ni de çözüyor. Duyuruya eşlik eden kısa notunda, çalışmayı Stepanov'un sonlu cisimler üzerindeki eğriler için verdiği argümanın soyundan gelen bir yaklaşıma kendisinin yönlendirdiğini anlatıyor. Teknik altyapının büyük kısmı ise Claude'dan gelmiş; fonksiyon cismi durumundaki ispatın dayandığı "katlılığı" taklit etmek için yaklaşık √X tane teta yükseltmesini (theta lift) zincirleme fikri de buna dâhil. Alpöge, kendi deyişiyle devasa ve okunamaz bir belge yayımlamak yerine yalnızca biçimsel ispatı paylaştı: 175.187 dosya ve 17,37 milyon satırdan oluşan bir Lean 4 arşivi.

Bu da bizim gibi meraklıları hiçbir insanın okuyamayacağı bir ispatla baş başa bıraktı. Ben de arşivi ve notu indirdim, Google'ın Gemini Neon üzerinde çalışan Antigravity ajanından Lean kaynak kodunu okuyup açıklamasını istedim. Ortaya aşağıdaki 43 sayfalık rehber çıktı. Rehber, argümanın mimarisini kodun statik incelemesinden yola çıkarak yeniden kuruyor. Her bölüm önce sade bir İngilizceyle, benzetmeler ve küçük çözümlü örneklerle açılıyor; Lean dosyalarındaki kesin önermeler ve eşitsizlikler ancak ondan sonra geliyor. Rehberi Alpöge yazmadı, gözden geçirmedi ya da onaylamadı.

![Rehberin kapağı: “Inside the Lean 4 Proof of the Generalized Riemann Hypothesis. A Non-Specialist Reader's Guide to the Ideas, Analogies, and Key Proof Steps of Levent Alpöge and Claude's Lean 4 Formalization.” Altında, rehberin 20 Kasım 2026 tarihli Lean 4 arşivinin statik incelemesinden yeniden kurulduğunu ve L. Alpöge'nin onu yazmadığını, gözden geçirmediğini ya da onaylamadığını belirten bir not var.](grh-reader-guide-cover.png)

**[Rehberi okuyun (PDF, 43 sayfa, İngilizce)](/pubs/grh-reader-guide/GRH_Reader_Friendly_Guide.pdf)**

*Rehberin titizliğini ve doğruluğunu yapay zekâlar üç kez denetledi (Gemini Neon High x 2, Claude Opus High).*
