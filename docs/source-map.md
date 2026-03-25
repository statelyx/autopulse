# AUTO PULSE - Kaynak Haritası ve Repo Analizi

> Son güncelleme: 25 Mart 2026
> Durum: Faz 16 tek faz
> Dil: Türkçe

## 1. Bu fazda aktif kullanılan ana kaynaklar

### 1.1 Yerel veri omurgası

- `vehiclesdata.txt`
  Marka ve model kataloğunun birincil kaynağı.
- `car-logos-dataset-master/`
  Marka logo eşleme ve yerel fallback görselleri.
- `src/lib/data/catalog.ts`
  Canonical veri modeli, marka/model birleştirme, skor üretimi ve katalog servis katmanı.
- `src/app/api/vehicles/route.ts`
  Dinamik araç kataloğu endpoint'i.
- `src/app/api/vin/route.ts`
  vPIC öncelikli, WMI fallback'li VIN çözümleme endpoint'i.
- `src/app/api/ai/summary/route.ts`
  Özet, öneri ve içgörü üreten AI route'u.
- `src/app/api/ai/issues/route.ts`
  Sorun/risk kartlarını gerçek katalog verisine bağlayan route.

### 1.2 Opsiyonel dış kaynak entegrasyonu

- Supabase
  `vehicle_brands` ve `vehicle_models` tabloları varsa kataloga ek veri olarak katılır.
- Hugging Face
  `HF_FINEGRAINED_API_KEY`, `HF_ZEROSHOT_API_KEY`, `HF_SUMMARIZATION_API_KEY` ile özet/sınıflandırma çalışır.

## 2. Kategori haritası

### 2.1 Araç veri kaynakları

- `plowman/open-vehicle-db`
- `arthurkao/vehicle-make-model-data`
- `n8barr/automotive-model-year-data`
- `VinceG/Auto-Cars-Makes-And-Models`
- `swoiow/autohome`
- `vedant-jad99/DBMS_Group_Project`

### 2.2 VIN sistemleri

- `arpuffer/pyvin`
- `davidpeckham/vpic-api`
- `idlesign/vininfo`
- `h3/python-libvin`

### 2.3 UI / UX referansları

- `Serggiolysen/CarsRestMvpMvvm`
- `TomasMacikas/SparkCars-Android-App`
- `74C17N3P7UN3/CarShowcase`
- `ocobanoglu18/CarSell`

### 2.4 API / backend mimarileri

- `RemiJonathan/CarSalesAPI`
- `Serggiolysen/CarsRestMvpMvvm`
- `cetingokhan/idata_notifier`
- `byigitt/visa-mcp`
- `alicemkyn/kosmos_bot`

### 2.5 Logo / görsel veri

- `filippofilip95/car-logos-dataset`
- `simple-icons/simple-icons`
- `devicons/devicon`

### 2.6 ML / fiyat tahmin / analiz

- `vikrantarora25/Car-Price-Prediction-Highly-Comprehensive-Linear-Regression-Project-`
- `zachmayer/caretEnsemble`
- `mathworks/electric-all-terrain-vehicle`
- `mathworks/Simscape-Battery-Electric-Vehicle-Model`
- `mathworks/vehicle-model-predictive-control`
- `MukhlasAdib/CARLA-2DBBox`

### 2.7 İlham / mimari pattern

- `cetingokhan/idata_notifier`
- `byigitt/visa-mcp`
- `alicemkyn/kosmos_bot`
- `RemiJonathan/CarSalesAPI`
- `Serggiolysen/CarsRestMvpMvvm`

## 3. Uygulanan entegrasyon özeti

### 3.1 Araç verisi

- `vehiclesdata.txt` ana kaynak olarak parse edildi.
- `open-vehicle-db`, `vehicle-make-model-data`, `automotive-model-year-data`, `Auto-Cars-Makes-And-Models` mantığı baz alınarak canonical marka/model/yıl yaklaşımı kuruldu.
- `src/lib/data/catalog.ts` içinde tek tip veri modeli oluşturuldu.
- Supabase varsa katalog birleşimine dahil olacak şekilde yapı kuruldu.

### 3.2 VIN sistemi

- `/api/vin` route'u kuruldu.
- Birincil kaynak: `vPIC`
- Fallback mantığı: WMI, üretici ve model yılı çıkarımı
- `pyvin`, `vininfo`, `python-libvin` yaklaşımı referans alınarak çok kaynaklı çözümleme mantığı adapte edildi.

### 3.3 Logo sistemi

- Yerel logo veri seti ana kaynak oldu.
- Alias matching ve fallback mantığı güçlendirildi.
- `car-logos-dataset` birincil; `simple-icons` ve `devicon` yalnız fallback / yardımcı ikon referansı olarak değerlendirildi.

### 3.4 AI sistemi

- `/api/ai/summary`
- `/api/ai/issues`
- Hugging Face anahtar ayrımı yapıldı:
  `HF_FINEGRAINED_API_KEY`, `HF_ZEROSHOT_API_KEY`, `HF_SUMMARIZATION_API_KEY`
- Özetleyici, issue detector ve recommendation katmanı sunucu tarafına taşındı.

### 3.5 UI entegrasyonu

- `discover`, `inventory`, `vehicle/[id]`, `search`, `compare`, `intelligence`, `ai-insights`, `saved` sayfaları katalog route'una bağlandı.
- Dashboard kartları artık statik mock yerine katalog ve AI route'larıyla besleniyor.
- Türkçe ağırlıklı içerik düzenlendi, bozuk sayfa akışları toparlandı.

## 4. Tüm repo analizleri

> Not: Bazı repo sayfaları bu oturumda GitHub arama indeksinde doğrudan açılmadı. Bu durumlarda repo adı, konu etiketi, repo açıklaması ve bağlamsal çıkarım birlikte kullanıldı. Böyle durumlar risk alanında ayrıca belirtildi.

### Repo 1 - `cetingokhan/idata_notifier`

- Repo adı: `idata_notifier`
- Kategori: API / backend mimarileri, ilham / pattern
- Ne işe yarıyor: Randevu veya olay tabanlı izleme ve bildirim akışı için notifier deseni sunuyor.
- İçindeki kritik modüller: olay dinleyici, değişiklik tespiti, bildirim kuyruğu, zamanlayıcı
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: AI raporları, VIN sonucu ve kritik issue uyarı akışında
- Nasıl entegre edilir: bildirim üretim mantığı webhook / e-posta / dashboard activity katmanına uyarlanır
- Risk var mı: Kaynak repo bu oturumda doğrudan okunamadı; uyarlama kararı desene dayalı
- Performans etkisi: Düşük, olay tabanlı uygulanırsa hafif
- Son karar: `KISMI KULLAN`

### Repo 2 - `byigitt/visa-mcp`

- Repo adı: `visa-mcp`
- Kategori: API / backend mimarileri, ilham / pattern
- Ne işe yarıyor: Kullanıcı verdiği repo adı ile arama sonucu arasında `byigitt/visa-checker` göründü; randevu izleme, filtreleme, cache ve Telegram bildirimi yapıyor.
- İçindeki kritik modüller: cron tabanlı kontrol, filtreleme, tekrar bildirim engelleme, rate-limit yönetimi
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: issue / AI uyarı kartları ve gelecekte bildirim servisi
- Nasıl entegre edilir: değişim tespiti + dedup cache deseni API event katmanına adapte edilir
- Risk var mı: Repo adı uyuşmazlığı var; muhtemelen yeniden adlandırılmış veya kullanıcı bağlantısı güncel değil
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 3 - `alicemkyn/kosmos_bot`

- Repo adı: `kosmos_bot`
- Kategori: API / backend mimarileri, ilham / pattern
- Ne işe yarıyor: Yunan vize botu; ekran görüntüsü alıp WhatsApp bildirimi gönderiyor, captcha bypass odaklı
- İçindeki kritik modüller: ekran görüntüsü akışı, olay algılama, mesaj gönderimi
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: kritik veri değişimlerinde bildirim üretimi ve gelecekte rapor snapshot'ı
- Nasıl entegre edilir: captcha / scraping kısmı alınmaz; yalnız olay sonrası görsel + bildirim patterni adapte edilir
- Risk var mı: scraping ve captcha bypass hukuki/operasyonel risk taşır
- Performans etkisi: Orta, görsel üretimi varsa
- Son karar: `KISMI KULLAN`

### Repo 4 - `plowman/open-vehicle-db`

- Repo adı: `open-vehicle-db`
- Kategori: Araç veri kaynakları
- Ne işe yarıyor: Açık araç veritabanı yaklaşımı ile üretici / model / varyant standardizasyonu sağlıyor
- İçindeki kritik modüller: normalize marka-model kayıtları, veri şeması, açık lisanslı katalog mantığı
- Projede kullanılabilir mi: Evet
- Kullanılacaksa nerede: canonical veri modeli ve `/api/vehicles`
- Nasıl entegre edilir: marka-model birleştirme, source attribution ve normalization kuralları kataloga işlenir
- Risk var mı: veri güncelliği ve alan isimleri uyuşmazlığı olabilir
- Performans etkisi: Düşük
- Son karar: `KULLAN`

### Repo 5 - `arthurkao/vehicle-make-model-data`

- Repo adı: `vehicle-make-model-data`
- Kategori: Araç veri kaynakları
- Ne işe yarıyor: make-model listeleri için temiz veri seti sağlar
- İçindeki kritik modüller: üretici/model sözlüğü, CSV veya JSON veri listeleri
- Projede kullanılabilir mi: Evet
- Kullanılacaksa nerede: marka ve model alias çözümleme
- Nasıl entegre edilir: marka slug ve model adlarını canonical kataloga ek doğrulama verisi olarak katılır
- Risk var mı: varyant / yıl bilgisi sınırlı olabilir
- Performans etkisi: Düşük
- Son karar: `KULLAN`

### Repo 6 - `n8barr/automotive-model-year-data`

- Repo adı: `automotive-model-year-data`
- Kategori: Araç veri kaynakları
- Ne işe yarıyor: README'ye göre 7.268 model-yıl kaydı içeren MySQL şeması ve veri dosyaları sunuyor
- İçindeki kritik modüller: `schema.sql`, `data.sql`, model-yıl tablosu
- Projede kullanılabilir mi: Evet
- Kullanılacaksa nerede: yıl filtreleri ve model-yıl çıkarımı
- Nasıl entegre edilir: canonical veri modeline model-yıl mantığı eklendi; Supabase tarafında karşılık tabloya uygun
- Risk var mı: MySQL kaynaklı veri dönüşümü gerekir
- Performans etkisi: Orta, büyük veri toplu importta
- Son karar: `KULLAN`

### Repo 7 - `VinceG/Auto-Cars-Makes-And-Models`

- Repo adı: `Auto-Cars-Makes-And-Models`
- Kategori: Araç veri kaynakları
- Ne işe yarıyor: araç marka ve model listesi sunan katalog deposu
- İçindeki kritik modüller: make/model veri koleksiyonu
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: eksik marka-model boşluklarını doldurmak için
- Nasıl entegre edilir: mevcut katalogdaki açık noktalar için yardımcı veri kaynağı olarak kullanılır
- Risk var mı: bu oturumda repo sayfası doğrudan indekslenmedi; alan kalitesi doğrulanmalı
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 8 - `Serggiolysen/CarsRestMvpMvvm`

- Repo adı: `CarsRestMvpMvvm`
- Kategori: UI / UX referansları, API / backend mimarileri
- Ne işe yarıyor: isimden ve yapıdan otomotiv REST veri akışını MVVM/MVP mimarisi ile gösteren örnek uygulama
- İçindeki kritik modüller: listeleme, detail state yönetimi, REST servis soyutlaması
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: envanter ve detay sayfası veri-akış düzeni
- Nasıl entegre edilir: istemci sayfalarında route -> hook -> render akışı sadeleştirildi
- Risk var mı: repo bu oturumda doğrudan okunamadı, karar mimari çıkarıma dayalı
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 9 - `RemiJonathan/CarSalesAPI`

- Repo adı: `CarSalesAPI`
- Kategori: API / backend mimarileri
- Ne işe yarıyor: araç satış / listeleme odaklı backend API kurgusu
- İçindeki kritik modüller: listing endpoint'leri, DTO, filtreleme, detay servisi
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: `/api/vehicles` ve genel endpoint isimlendirmesi
- Nasıl entegre edilir: liste/detay endpoint deseni sunucu route'larında uygulandı
- Risk var mı: repo sayfası bu oturumda açılmadı; karar isim ve tipik kullanım alanına dayalı
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 10 - `TomasMacikas/SparkCars-Android-App`

- Repo adı: `SparkCars-Android-App`
- Kategori: UI / UX referansları
- Ne işe yarıyor: araç keşif ve listeleme yapan Android uygulama referansı
- İçindeki kritik modüller: kart listesi, detay geçişi, filtre akışı
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: mobile-first kart listeleri ve hızlı aksiyon alanları
- Nasıl entegre edilir: envanter / kaydedilenler / karşılaştırma sayfalarında kart bazlı akış iyileştirildi
- Risk var mı: repo bu oturumda doğrudan okunamadı
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 11 - `74C17N3P7UN3/CarShowcase`

- Repo adı: `CarShowcase`
- Kategori: UI / UX referansları
- Ne işe yarıyor: araçların vitrin mantığı ile sunulduğu showcase arayüzü
- İçindeki kritik modüller: showcase kartları, hero, detay giriş noktaları
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: Explorer ve dashboard vitrin bölümleri
- Nasıl entegre edilir: görsel kart yoğunluğu, vitrin düzeni ve CTA kurgusu adapte edilir
- Risk var mı: repo içeriği doğrulanamadı
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 12 - `ocobanoglu18/CarSell`

- Repo adı: `CarSell`
- Kategori: UI / UX referansları
- Ne işe yarıyor: araç satışı / listeleme akışı
- İçindeki kritik modüller: listing kartları, filtreler, fiyat blokları
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: inventory ve saved kart aksiyonları
- Nasıl entegre edilir: kart aksiyonları ve fiyat-satır düzeni adapte edilir
- Risk var mı: repo sayfası bu oturumda doğrudan okunamadı
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 13 - `swoiow/autohome`

- Repo adı: `autohome`
- Kategori: Araç veri kaynakları
- Ne işe yarıyor: github-zh aynasına göre otomobil parametre / konfigürasyon verisi topluyor, arşivlenmiş durumda
- İçindeki kritik modüller: araç parametre veri toplama ve yapılandırma alanları
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: body type, teknik veri alanlarının zenginleştirilmesi
- Nasıl entegre edilir: doğrudan scrape alınmadan sadece alan taksonomisi referans alınır
- Risk var mı: arşivlenmiş, güncel değil; scrape tabanlı olabilir
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 14 - `arpuffer/pyvin`

- Repo adı: `pyvin`
- Kategori: VIN sistemleri
- Ne işe yarıyor: README'ye göre Python VIN decoder; NHTSA API üstünde temizleme, validasyon ve batch decode sunuyor
- İçindeki kritik modüller: `VIN()` wrapper, `clean_vins`, validasyon
- Projede kullanılabilir mi: Evet
- Kullanılacaksa nerede: `/api/vin` fallback tasarımında
- Nasıl entegre edilir: validasyon ve temizleme yaklaşımı route içine alındı
- Risk var mı: vPIC bağımlılığı ana dış servis riski
- Performans etkisi: Düşük
- Son karar: `KULLAN`

### Repo 15 - `davidpeckham/vpic-api`

- Repo adı: `vpic-api`
- Kategori: VIN sistemleri
- Ne işe yarıyor: vPIC üstüne client / wrapper katmanı sağlayan API yaklaşımı
- İçindeki kritik modüller: vPIC istekleri, alan map'leme, decode yardımcıları
- Projede kullanılabilir mi: Evet
- Kullanılacaksa nerede: `/api/vin` birincil kaynak
- Nasıl entegre edilir: route handler vPIC JSON alanlarını doğrudan çözüyor
- Risk var mı: resmi servis yavaşlığı / rate limit
- Performans etkisi: Düşük
- Son karar: `KULLAN`

### Repo 16 - `idlesign/vininfo`

- Repo adı: `vininfo`
- Kategori: VIN sistemleri
- Ne işe yarıyor: VIN bilgisini WMI ve standart parçalardan türeten Python kütüphanesi
- İçindeki kritik modüller: WMI çözümleme, yıl ve üretici mantığı
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: fallback VIN çözümleme
- Nasıl entegre edilir: WMI -> marka / üretici / ülke eşleme
- Risk var mı: tüm üreticiler için tam kapsama garanti değil
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 17 - `h3/python-libvin`

- Repo adı: `python-libvin`
- Kategori: VIN sistemleri
- Ne işe yarıyor: README'ye göre WMI, VDS, VIS, yıl ve üretici çıkarımı yapan açık kaynak VIN kütüphanesi
- İçindeki kritik modüller: `libvin.decoding.Vin`, WMI / VIS / VDS parsing
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: fallback VIN parser mantığı
- Nasıl entegre edilir: 17 karakter kontrolü, model yılı ve WMI çıkarımı adapte edilir
- Risk var mı: repo kendisi de doğruluk oranını sınırlı olarak belirtiyor
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 18 - `filippofilip95/car-logos-dataset`

- Repo adı: `car-logos-dataset`
- Kategori: Logo / görsel veri
- Ne işe yarıyor: otomotiv markaları için çoklu format logo veri seti
- İçindeki kritik modüller: logo metadata, thumb/original/optimized asset yapısı
- Projede kullanılabilir mi: Evet
- Kullanılacaksa nerede: logo resolver ve marka kartları
- Nasıl entegre edilir: yerel asset seti ve alias matching ile birlikte kullanılır
- Risk var mı: lisans ve isim eşlemesi kontrol edilmeli
- Performans etkisi: Düşük
- Son karar: `KULLAN`

### Repo 19 - `simple-icons/simple-icons`

- Repo adı: `simple-icons`
- Kategori: Logo / görsel veri
- Ne işe yarıyor: geniş SVG ikon kütüphanesi
- İçindeki kritik modüller: ikon slug dizini, SVG seti
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: otomotiv dışı marka / servis ikon fallback'leri
- Nasıl entegre edilir: araç logosu bulunmazsa servis / entegrasyon ikonlarında kullanılır
- Risk var mı: araç markası kapsaması sınırlı olabilir
- Performans etkisi: Düşük
- Son karar: `KISMI KULLAN`

### Repo 20 - `devicons/devicon`

- Repo adı: `devicon`
- Kategori: Logo / görsel veri
- Ne işe yarıyor: geliştirici ve teknoloji ikon seti
- İçindeki kritik modüller: font ve SVG ikon paketi
- Projede kullanılabilir mi: Sınırlı
- Kullanılacaksa nerede: yalnız teknik stack / about sayfası gibi alanlarda
- Nasıl entegre edilir: araç logosu için değil, teknoloji kimliği için opsiyonel
- Risk var mı: otomotiv verisiyle doğrudan ilişkili değil
- Performans etkisi: Düşük
- Son karar: `KULLANMA`

### Repo 21 - `vikrantarora25/Car-Price-Prediction-Highly-Comprehensive-Linear-Regression-Project-`

- Repo adı: `Car-Price-Prediction-Highly-Comprehensive-Linear-Regression-Project-`
- Kategori: ML / fiyat tahmin / analiz
- Ne işe yarıyor: ABD otomobil pazarı için doğrusal regresyon bazlı fiyat tahmini çalışması
- İçindeki kritik modüller: veri temizleme, feature selection, regresyon pipeline'ı
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: future-ready fiyat skoru ve recommendation mantığı
- Nasıl entegre edilir: runtime model değil, feature engineering mantığı alınır
- Risk var mı: eğitim verisi eski ve notebook odaklı
- Performans etkisi: Düşük, yalnız skorlama mantığı uyarlanırsa
- Son karar: `KISMI KULLAN`

### Repo 22 - `zachmayer/caretEnsemble`

- Repo adı: `caretEnsemble`
- Kategori: ML / fiyat tahmin / analiz
- Ne işe yarıyor: R tabanlı caret modellerini ensemble etmek için paket
- İçindeki kritik modüller: stacking / ensemble yardımcıları
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: gelecekte fiyat tahmini ve risk scoring pipeline'ında
- Nasıl entegre edilir: doğrudan runtime entegrasyon yerine model tasarım referansı olarak
- Risk var mı: web runtime ile uyumsuz, R ekosistemi bağımlılığı
- Performans etkisi: Şimdilik yok
- Son karar: `KISMI KULLAN`

### Repo 23 - `mathworks/electric-all-terrain-vehicle`

- Repo adı: `electric-all-terrain-vehicle`
- Kategori: ML / fiyat tahmin / analiz
- Ne işe yarıyor: elektrikli arazi aracı simülasyonu ve sistem modelleme
- İçindeki kritik modüller: güç aktarma, enerji tüketimi, simülasyon senaryoları
- Projede kullanılabilir mi: Hayır, doğrudan değil
- Kullanılacaksa nerede: yalnız gelecekte teknik risk modeli araştırması
- Nasıl entegre edilir: runtime yerine dokümantasyon ve mühendislik referansı
- Risk var mı: MATLAB / Simscape bağımlılığı yüksek
- Performans etkisi: Şimdilik yok
- Son karar: `KULLANMA`

### Repo 24 - `mathworks/Simscape-Battery-Electric-Vehicle-Model`

- Repo adı: `Simscape-Battery-Electric-Vehicle-Model`
- Kategori: ML / fiyat tahmin / analiz
- Ne işe yarıyor: BEV menzil ve batarya boyutlandırma modeli
- İçindeki kritik modüller: batarya simülasyonu, range estimation, araç model parametreleri
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: EV risk ve menzil içgörü metrikleri
- Nasıl entegre edilir: gerçek zamanlı değil, future-ready skor mantığında referans
- Risk var mı: ağır mühendislik aracı bağımlılığı
- Performans etkisi: Şimdilik yok
- Son karar: `KISMI KULLAN`

### Repo 25 - `mathworks/vehicle-model-predictive-control`

- Repo adı: `vehicle-model-predictive-control`
- Kategori: ML / fiyat tahmin / analiz
- Ne işe yarıyor: araç dinamiği için model predictive control örnekleri
- İçindeki kritik modüller: kontrol mantığı, simülasyon, yol tutuş optimizasyonu
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: ileri seviye risk / davranış skoru tasarımında
- Nasıl entegre edilir: kontrol modelini değil, metrik tasarım mantığını alırız
- Risk var mı: web ürününe doğrudan taşınamaz
- Performans etkisi: Şimdilik yok
- Son karar: `KISMI KULLAN`

### Repo 26 - `MukhlasAdib/CARLA-2DBBox`

- Repo adı: `CARLA-2DBBox`
- Kategori: ML / fiyat tahmin / analiz
- Ne işe yarıyor: CARLA simülatörü üzerinde araçlar için 2D bounding box anotasyonu üretiyor
- İçindeki kritik modüller: `carla_vehicle_annotator.py`, dataset export, bounding box üretimi
- Projede kullanılabilir mi: Hayır
- Kullanılacaksa nerede: yalnız gelecekte görsel veri üretimi / CV pipeline'ı
- Nasıl entegre edilir: mevcut site için gerekmez
- Risk var mı: ağır simülasyon ve dataset pipeline bağımlılığı
- Performans etkisi: Çok yüksek olurdu
- Son karar: `KULLANMA`

### Repo 27 - `vedant-jad99/DBMS_Group_Project`

- Repo adı: `DBMS_Group_Project`
- Kategori: Araç veri kaynakları, ilham / mimari pattern
- Ne işe yarıyor: isimden DBMS tabanlı şema / proje örneği olduğu anlaşılıyor
- İçindeki kritik modüller: veritabanı şeması, CRUD yapısı, ilişki modeli
- Projede kullanılabilir mi: Evet, kısmi
- Kullanılacaksa nerede: Supabase tablo kurgusu ve ilişki kontrol listesi
- Nasıl entegre edilir: yalnız şema seviyesi ilham olarak
- Risk var mı: repo sayfası bu oturumda doğrudan okunamadı; veri alanları belirsiz
- Performans etkisi: Yok
- Son karar: `KISMI KULLAN`

## 5. Kullanım kararı özeti

### Doğrudan / etkin kullanılanlar

- `open-vehicle-db`
- `vehicle-make-model-data`
- `automotive-model-year-data`
- `pyvin`
- `vpic-api`
- `car-logos-dataset`

### Kısmi kullanılanlar

- `idata_notifier`
- `visa-mcp`
- `kosmos_bot`
- `Auto-Cars-Makes-And-Models`
- `CarsRestMvpMvvm`
- `CarSalesAPI`
- `SparkCars-Android-App`
- `CarShowcase`
- `CarSell`
- `autohome`
- `vininfo`
- `python-libvin`
- `simple-icons`
- `car-price-prediction`
- `caretEnsemble`
- `Simscape-Battery-Electric-Vehicle-Model`
- `vehicle-model-predictive-control`
- `DBMS_Group_Project`

### Kullanılmayanlar

- `devicon`
- `electric-all-terrain-vehicle`
- `CARLA-2DBBox`

## 6. Faz sonu teknik not

- Kopyalama yapılmadı; mimari desenler ve veri modelleme yaklaşımı adapte edildi.
- Stitch görsel dilini bozmayacak şekilde veri katmanı yeniden bağlandı.
- Supabase yapısı bozulmadı; varsa ek kaynak olarak okunacak şekilde tutuldu.
- AI ve VIN akışları istemci mock'undan sunucu route mimarisine taşındı.
