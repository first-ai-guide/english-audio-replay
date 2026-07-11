const CACHE_NAME = 'audio-replay-v20';
const CORE_FILES = ['./', './index.html', './manifest.json'];
const OPTIONAL_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  './sample/i_arrived_earlier_than_my_checkin_time_could_you_p.zip',
  './sample/when_i_entered_the_room_it_smelt_of_cigarettes_can.zip',
  './sample/can_i_change_some_money_please.zip',
  './sample/the_air_con_isnt_working_well_so_could_i_change_ro.zip',
  './sample/could_you_book_a_taxi_for_tomorrow_morning_please.zip',
  './sample/it_is_very_noisy_next_door_and_i_cannot_sleep_coul.zip',
  './sample/could_i_have_another_blanket_please.zip',
  './sample/can_i_stay_for_one_more_night.zip',
  './sample/could_you_keep_my_luggage_for_two_hours_after_i_ch.zip',
  './sample/can_we_change_the_breakfast_time_tomorrow_to_7_ocl.zip'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_FILES);
      await Promise.all(OPTIONAL_FILES.map((url) =>
        cache.add(url).catch((err) => console.warn('precache skipped:', url, err))
      ));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
