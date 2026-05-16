<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-2 mt-5 text-blue-darken-3">Nadzorna ploča</h1>
        <p class="text-h6 text-grey-darken-1 mb-8">Pregled statistike za APK Zrinjski Mostar</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="4" color="blue-lighten-4" class="text-center rounded-lg">
          <v-card-item>
            <v-card-title class="text-h5 text-blue-darken-4 mt-2">Treneri</v-card-title>
          </v-card-item>
          <v-card-text class="text-h2 font-weight-bold text-blue-darken-4 pb-5">
            {{ brojTrenera }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="4" color="teal-lighten-4" class="text-center rounded-lg">
          <v-card-item>
            <v-card-title class="text-h5 text-teal-darken-4 mt-2">Grupe</v-card-title>
          </v-card-item>
          <v-card-text class="text-h2 font-weight-bold text-teal-darken-4 pb-5">
            {{ brojGrupa }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="4" color="cyan-lighten-4" class="text-center rounded-lg">
          <v-card-item>
            <v-card-title class="text-h5 text-cyan-darken-4 mt-2">Plivači</v-card-title>
          </v-card-item>
          <v-card-text class="text-h2 font-weight-bold text-cyan-darken-4 pb-5">
            {{ brojPlivaca }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card elevation="4" color="light-blue-lighten-4" class="text-center rounded-lg">
          <v-card-item>
            <v-card-title class="text-h5 text-light-blue-darken-4 mt-2">Termini</v-card-title>
          </v-card-item>
          <v-card-text class="text-h2 font-weight-bold text-light-blue-darken-4 pb-5">
            {{ brojTermina }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Ovdje čuvamo brojke za svaku kategoriju
const brojTrenera = ref(0)
const brojGrupa = ref(0)
const brojPlivaca = ref(0)
const brojTermina = ref(0)

// Funkcija koja zove sve tvoje API rute i samo broji koliko ih ima
const dohvatiStatistiku = async () => {
  try {
    // Čekamo da se svi podaci povuku paralelno (brže je)
    const [treneriRes, grupeRes, plivaciRes, terminiRes] = await Promise.all([
      fetch('http://127.0.0.1:5000/api/treneri'),
      fetch('http://127.0.0.1:5000/api/grupe'),
      fetch('http://127.0.0.1:5000/api/plivaci'),
      fetch('http://127.0.0.1:5000/api/termini')
    ])

    const treneri = await treneriRes.json()
    const grupe = await grupeRes.json()
    const plivaci = await plivaciRes.json()
    const termini = await terminiRes.json()

    // Upisujemo duljinu niza (broj zapisa u bazi) u naše varijable
    brojTrenera.value = treneri.length || 0
    brojGrupa.value = grupe.length || 0
    brojPlivaca.value = plivaci.length || 0
    brojTermina.value = termini.length || 0
  } catch (error) {
    console.error("Greška pri učitavanju statistike:", error)
  }
}

// Pokreni čim se otvori početna stranica
onMounted(() => {
  dohvatiStatistiku()
})
</script>