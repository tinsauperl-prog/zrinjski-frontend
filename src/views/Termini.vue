<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        
        <div class="d-flex align-center justify-space-between mb-8 header-section">
          <div>
            <h1 class="text-h3 font-weight-black text-gradient mb-1">Termini</h1>
            
          </div>
          <v-btn class="btn-gradient text-white font-weight-bold px-6" elevation="4" rounded="xl" size="large" @click="otvoriDodavanje">
            <v-icon start size="22">mdi-plus</v-icon>
            Novi termin
          </v-btn>
        </div>

        <v-card elevation="2" rounded="xl" class="custom-table-card overflow-hidden">
          <v-table class="modern-table">
            <thead>
              <tr>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4 pl-6">ID</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Datum i Vrijeme</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Fokus Treninga</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Grupa</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4 text-right pr-6">Akcije</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="termin in termini" :key="termin.id" class="table-row-animate">
                <td class="text-medium-emphasis font-weight-medium pl-6">#{{ termin.id }}</td>
                
                <td>
                  <div class="d-flex align-center py-3">
                    <v-avatar color="blue-lighten-5" class="mr-4 shadow-sm text-blue-darken-1" size="44">
                      <v-icon>mdi-calendar-clock-outline</v-icon>
                    </v-avatar>
                    <div class="font-weight-bold text-subtitle-1 text-high-emphasis">{{ termin.datum_vrijeme }}</div>
                  </div>
                </td>

                <td>
                  <v-chip color="blue-grey-darken-1" size="small" variant="tonal" class="font-weight-bold rounded-lg px-3">
                    {{ termin.fokus_treninga }}
                  </v-chip>
                </td>

                <td>
                  <v-chip color="teal-darken-1" size="small" variant="outlined" class="font-weight-bold rounded-lg px-3">
                    {{ nadiImeGrupe(termin.grupa_id) }}
                  </v-chip>
                </td>

                <td class="text-right pr-6">
                  <v-btn icon variant="text" color="blue-darken-1" class="mr-1 action-btn" @click="pripremiUredivanje(termin)" title="Uredi">
                    <v-icon size="22">mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" color="red-lighten-1" class="action-btn" @click="pripremiBrisanje(termin.id)" title="Obriši">
                    <v-icon size="22">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="520px" transition="dialog-bottom-transition">
          <v-card rounded="xl" class="pa-4 border-light">
            <v-card-title class="pa-4">
              <span class="text-h5 font-weight-black text-high-emphasis">{{ isEditing ? 'Ažuriraj termin' : 'Novi termin' }}</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-container class="px-0 py-0">
                <v-row>
                  <v-col cols="12" sm="6" class="py-2">
                    <v-select 
                      v-model="formaTermin.datum_vrijeme" 
                      :items="ponudeniTermini" 
                      label="Odaberi termin" 
                      variant="outlined" 
                      color="primary" 
                      rounded="lg" 
                      prepend-inner-icon="mdi-calendar-clock-outline">
                    </v-select>
                  </v-col>
                  
                  <v-col cols="12" sm="6" class="py-2">
                    <v-select 
                      v-model="formaTermin.fokus_treninga" 
                      :items="ponudeniFokusi" 
                      label="Fokus treninga" 
                      variant="outlined" 
                      color="primary" 
                      rounded="lg" 
                      prepend-inner-icon="mdi-target">
                    </v-select>
                  </v-col>

                  <v-col cols="12" class="py-2">
                    <v-select v-model="formaTermin.grupa_id" :items="grupe" item-title="naziv" item-value="id" label="Odaberi grupu" variant="outlined" color="primary" rounded="lg"></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="px-4 font-weight-bold" @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="primary" variant="elevated" class="px-6 font-weight-bold" rounded="lg" elevation="2" @click="spremiTermin">Spremi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="420px">
          <v-card rounded="xl" class="pa-4">
            <div class="text-center pa-4">
              <v-icon color="error" size="64" class="mb-3 animate-pulse">mdi-alert-circle-outline</v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">Potvrda brisanja</h3>
              <p class="text-body-1 text-medium-emphasis">Jeste li sigurni da želite ukloniti ovog termin?</p>
            </div>
            <v-card-actions class="px-4 pb-2">
              <v-btn color="grey-darken-1" variant="text" class="flex-grow-1 font-weight-bold" @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="elevated" class="flex-grow-1 font-weight-bold" rounded="lg" @click="obrisiTermin">Ukloni</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const termini = ref([])
const grupe = ref([]) 

const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

const formaTermin = ref({ id: null, datum_vrijeme: '', fokus_treninga: '', grupa_id: null })

// Lista ponuđenih termina
const ponudeniTermini = ref([
  'Ponedjeljak 17:00', 'Ponedjeljak 18:00', 'Ponedjeljak 19:00',
  'Utorak 17:00', 'Utorak 18:00', 'Utorak 19:00',
  'Srijeda 17:00', 'Srijeda 18:00', 'Srijeda 19:00',
  'Četvrtak 17:00', 'Četvrtak 18:00', 'Četvrtak 19:00',
  'Petak 17:00', 'Petak 18:00', 'Petak 19:00',
  'Subota 09:00', 'Subota 10:00', 'Subota 11:00'
])

// NOVO: Definirane fiksne opcije za fokus treninga
const ponudeniFokusi = ref([
  'Kondicija',
  'Snaga',
  'Tehnika',
  'Brzina',
  'Oporavak'
])

const dohvatiTermine = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/termini')
  termini.value = await res.json()
}

const dohvatiGrupe = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/grupe')
  grupe.value = await res.json()
}

const nadiImeGrupe = (id) => {
  const g = grupe.value.find(x => x.id === id)
  return g ? g.naziv : 'Nema grupe'
}

const otvoriDodavanje = () => {
  isEditing.value = false
  formaTermin.value = { id: null, datum_vrijeme: '', fokus_treninga: null, grupa_id: null }
  dialog.value = true
}

const pripremiUredivanje = (termin) => {
  isEditing.value = true
  formaTermin.value = { ...termin }
  dialog.value = true
}

const spremiTermin = async () => {
  const metoda = isEditing.value ? 'PUT' : 'POST'
  const url = isEditing.value 
    ? `http://127.0.0.1:5000/api/termini/${formaTermin.value.id}` 
    : 'http://127.0.0.1:5000/api/termini'

  await fetch(url, {
    method: metoda,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formaTermin.value)
  })
  
  zatvoriDialog()
  dohvatiTermine()
}

const zatvoriDialog = () => { dialog.value = false }

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiTermin = async () => {
  await fetch(`http://127.0.0.1:5000/api/termini/${idZaBrisanje.value}`, { method: 'DELETE' })
  dialogBrisanje.value = false
  dohvatiTermine()
}

onMounted(() => {
  dohvatiGrupe().then(() => dohvatiTermine())
})
</script>

<style scoped>
.text-gradient { background: linear-gradient(45deg, #1867C0, #5CBBF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.btn-gradient { background: linear-gradient(45deg, #1867C0, #2196F3) !important; transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
.btn-gradient:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4) !important; }
.table-row-animate { transition: background-color 0.25s ease; }
.table-row-animate:hover { background-color: #F8FAFC !important; }
.action-btn { transition: transform 0.2s ease !important; }
.action-btn:hover { transform: scale(1.15); }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
.animate-pulse { animation: pulse 2s infinite ease-in-out; }
.border-light { border: 1px solid rgba(0,0,0,0.05); }
.shadow-sm { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
</style>x