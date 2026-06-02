<template>
  <v-container class="pa-0 modern-dashboard" fluid>
    <v-img
      src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1920&auto=format&fit=crop"
      height="380"
      cover
      class="align-end text-white position-relative"
      gradient="to bottom, rgba(21, 101, 192, 0.7), rgba(183, 28, 28, 0.8)"
    >
      <v-avatar class="club-logo-watermark" size="280">
        <v-icon color="white">mdi-water-check</v-icon>
      </v-avatar>

      <v-container class="position-relative z-index-1 pb-10">
        <div class="d-flex justify-space-between align-center mb-2">
          <div>
            <h1 class="text-h3 font-weight-black mb-1">Nadzorna ploča</h1>
            <p class="text-subtitle-1 opacity-90 mb-0">Dobrodošli natrag u Nadzornu ploču APK Zrinjski Mostar.</p>
          </div>
          <div class="text-right">
            <div class="text-h6 font-weight-medium">{{ danasnjiDatum }}</div>
            <div class="text-caption opacity-80">Vaš klub, vaša statistika za danas</div>
          </div>
        </div>
      </v-container>
    </v-img>

    <v-container class="mt-n16 position-relative z-index-2">
      <v-row class="px-2">
        
        <v-col cols="12" sm="6" md="3" class="py-3">
          <v-card elevation="8" rounded="xl" class="stat-card bg-gradient-blue text-white overflow-hidden" hover>
            <div class="pa-6 position-relative z-index-1">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-1 font-weight-bold text-uppercase opacity-80">Treneri</span>
                <v-icon size="32" class="opacity-80">mdi-whistle-outline</v-icon>
              </div>
              <div class="text-h2 font-weight-black">{{ brojTrenera }}</div>
              <div class="text-caption opacity-80 mt-1">Članova trenerskog kadra</div>
            </div>
            <v-icon class="bg-icon">mdi-whistle-outline</v-icon>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="py-3">
          <v-card elevation="8" rounded="xl" class="stat-card bg-gradient-purple text-white overflow-hidden" hover>
            <div class="pa-6 position-relative z-index-1">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-1 font-weight-bold text-uppercase opacity-80">Grupe</span>
                <v-icon size="32" class="opacity-80">mdi-account-group-outline</v-icon>
              </div>
              <div class="text-h2 font-weight-black">{{ brojGrupa }}</div>
              <div class="text-caption opacity-80 mt-1">Organiziranih skupina</div>
            </div>
            <v-icon class="bg-icon">mdi-account-group-outline</v-icon>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="py-3">
          <v-card elevation="8" rounded="xl" class="stat-card bg-gradient-teal text-white overflow-hidden" hover>
            <div class="pa-6 position-relative z-index-1">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-1 font-weight-bold text-uppercase opacity-80">Plivači</span>
                <v-icon size="32" class="opacity-80">mdi-swim</v-icon>
              </div>
              <div class="text-h2 font-weight-black">{{ brojPlivaca }}</div>
              <div class="text-caption opacity-80 mt-1">Aktivnih članova kluba</div>
            </div>
            <v-icon class="bg-icon">mdi-swim</v-icon>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="py-3">
          <v-card elevation="8" rounded="xl" class="stat-card bg-gradient-orange text-white overflow-hidden" hover>
            <div class="pa-6 position-relative z-index-1">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-1 font-weight-bold text-uppercase opacity-80">Termini</span>
                <v-icon size="32" class="opacity-80">mdi-calendar-clock-outline</v-icon>
              </div>
              <div class="text-h2 font-weight-black">{{ brojTermina }}</div>
              <div class="text-caption opacity-80 mt-1">Planiranih treninga</div>
            </div>
            <v-icon class="bg-icon">mdi-calendar-clock-outline</v-icon>
          </v-card>
        </v-col>

      </v-row>
    </v-container>

    <v-container class="py-8 z-index-2 position-relative">
      <v-row>
        <v-col cols="12" md="7">
          <h2 class="text-h5 font-weight-bold mb-5 text-high-emphasis">Brze akcije</h2>
          <v-row>
            <v-col v-for="(akcija, i) in brzeAkcije" :key="i" cols="6" sm="4" class="py-2">
              <v-card rounded="xl" variant="outlined" color="primary" class="quick-action pa-5 text-center" link :to="akcija.to">
                <v-icon size="36" color="primary" class="mb-3">{{ akcija.icon }}</v-icon>
                <div class="font-weight-bold text-body-1 text-primary text-uppercase">{{ akcija.naslov }}</div>
                <div class="text-caption text-medium-emphasis">{{ akcija.opis }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="5">
          <h2 class="text-h5 font-weight-bold mb-5 text-high-emphasis">Vijesti i obavijesti</h2>
          <v-card rounded="xl" class="pa-5 border-light">
            <v-list lines="two" class="bg-transparent pa-0">
              <v-list-item v-for="(vijest, j) in mockVijesti" :key="j" class="px-0 py-2 border-bottom-light" :prepend-icon="vijest.icon">
                <v-list-item-title class="font-weight-bold text-high-emphasis">{{ vijest.naslov }}</v-list-item-title>
                <v-list-item-subtitle class="text-medium-emphasis">{{ vijest.datum }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const brojTrenera = ref(0)
const brojGrupa = ref(0)
const brojPlivaca = ref(0)
const brojTermina = ref(0)
const danasnjiDatum = ref('')

// Brze akcije navigacija
const brzeAkcije = [
  { naslov: 'Plivač', opis: 'Dodaj plivača', icon: 'mdi-swim', to: '/plivaci' },
  { naslov: 'Grupa', opis: 'Nova grupa', icon: 'mdi-account-group-outline', to: '/grupe' },
  { naslov: 'Termin', opis: 'Novi termin', icon: 'mdi-calendar-plus', to: '/termini' },
]

// Mock podaci za vijesti
const mockVijesti = [
  { naslov: 'Novi termini treninga za seniore', datum: 'Danas, 10:00', icon: 'mdi-bell-outline' },
  { naslov: 'Prijava za državno prvenstvo', datum: 'Jučer, 16:30', icon: 'mdi-certificate-outline' },
  { naslov: 'Održana skupština kluba', datum: 'Prije 3 dana', icon: 'mdi-account-tie-outline' },
]

const ucitajStatistiku = async () => {
  try {
    const resTreneri = await fetch('http://127.0.0.1:5000/api/treneri')
    const podaciTreneri = await resTreneri.json()
    brojTrenera.value = podaciTreneri.length

    const resGrupe = await fetch('http://127.0.0.1:5000/api/grupe')
    const podaciGrupe = await resGrupe.json()
    brojGrupa.value = podaciGrupe.length

    const resPlivaci = await fetch('http://127.0.0.1:5000/api/plivaci')
    const podaciPlivaci = await resPlivaci.json()
    brojPlivaca.value = podaciPlivaci.length

    const resTermini = await fetch('http://127.0.0.1:5000/api/termini')
    const podaciTermini = await resTermini.json()
    brojTermina.value = podaciTermini.length

  } catch (error) {
    console.error("Greška pri učitavanju statistike:", error)
  }
}

// Funkcija za dobivanje današnjeg datuma
const dohvatiDatum = () => {
  const opcije = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  danasnjiDatum.value = new Date().toLocaleDateString('hr-HR', opcije);
}

onMounted(() => {
  dohvatiDatum()
  ucitajStatistiku()
})
</script>

<style scoped>
/* Osnovni kontejner */
.modern-dashboard { background-color: #fafafa; min-height: 100vh; }

/* Stilovi za stat kartice */
.stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease !important; cursor: default; }
.stat-card:hover { transform: translateY(-8px); box-shadow: 0 16px 32px rgba(0,0,0,0.2) !important; }

/* Gradijenti za kartice */
.bg-gradient-blue { background: linear-gradient(135deg, #2196F3 0%, #1565C0 100%) !important; }
.bg-gradient-purple { background: linear-gradient(135deg, #E91E63 0%, #7B1FA2 100%) !important; }
.bg-gradient-teal { background: linear-gradient(135deg, #00E676 0%, #00796B 100%) !important; }
.bg-gradient-orange { background: linear-gradient(135deg, #FFB74D 0%, #EF6C00 100%) !important; }

/* Pomocni stilovi */
.position-relative { position: relative; }
.position-absolute { position: absolute; }
.z-index-1 { z-index: 1; }
.z-index-2 { z-index: 2; }
.opacity-80 { opacity: 0.8; }
.opacity-90 { opacity: 0.9; }

/* Velika dekorativna ikona u pozadini kartice (vodeni žig) */
.bg-icon {
  position: absolute !important;
  right: -30px;
  bottom: -30px;
  font-size: 160px !important;
  opacity: 0.15;
  transform: rotate(-15deg);
  z-index: 0;
  pointer-events: none;
}

/* Vodeni žig logotipa kluba u banneru */
.club-logo-watermark {
  position: absolute !important;
  top: 15px;
  right: 5%;
  opacity: 0.08;
  pointer-events: none;
}
.club-logo-watermark .v-icon { font-size: 280px !important; }

/* Brze akcije stil */
.quick-action {
  transition: background-color 0.2s ease, transform 0.2s ease !important;
  border: 1px solid rgba(21, 101, 192, 0.1) !important;
}
.quick-action:hover {
  background-color: rgba(21, 101, 192, 0.03) !important;
  transform: scale(1.02);
}

.border-light { border: 1px solid rgba(0,0,0,0.05); }
.border-bottom-light { border-bottom: 1px solid rgba(0,0,0,0.03); }
</style>