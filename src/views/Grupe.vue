<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        
        <div class="d-flex align-center justify-space-between mb-8 header-section">
          <div>
            <h1 class="text-h3 font-weight-black text-gradient mb-1">Grupe</h1>
            
          </div>
          <v-btn class="btn-gradient text-white font-weight-bold px-6" elevation="4" rounded="xl" size="large" @click="otvoriDodavanje">
            <v-icon start size="22">mdi-plus</v-icon>
            Nova grupa
          </v-btn>
        </div>

        <v-card elevation="2" rounded="xl" class="custom-table-card overflow-hidden">
          <v-table class="modern-table">
            <thead>
              <tr>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4 pl-6">ID</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Naziv Grupe</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Zaduženi Trener</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4 text-right pr-6">Akcije</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="grupa in grupe" :key="grupa.id" class="table-row-animate">
                <td class="text-medium-emphasis font-weight-medium pl-6">#{{ grupa.id }}</td>
                
                <td>
                  <div class="d-flex align-center py-3">
                    <v-avatar color="indigo-lighten-5" class="mr-4 shadow-sm text-indigo" size="44">
                      <v-icon>mdi-account-group-outline</v-icon>
                    </v-avatar>
                    <div class="font-weight-bold text-subtitle-1 text-high-emphasis">{{ grupa.naziv }}</div>
                  </div>
                </td>

                <td>
                  <v-chip color="deep-purple-darken-1" size="md" variant="outlined" class="font-weight-bold px-3 rounded-lg" prepend-icon="mdi-account-tie">
                    {{ nadiImeTrenera(grupa.trener_id) }}
                  </v-chip>
                </td>

                <td class="text-right pr-6">
                  <v-btn icon variant="text" color="blue-darken-1" class="mr-1 action-btn" @click="pripremiUredivanje(grupa)" title="Uredi">
                    <v-icon size="22">mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" color="red-lighten-1" class="action-btn" @click="pripremiBrisanje(grupa.id)" title="Obriši">
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
              <span class="text-h5 font-weight-black text-high-emphasis">{{ isEditing ? 'Uredi grupu' : 'Nova grupa' }}</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-container class="px-0 py-0">
                <v-row>
                  <v-col cols="12" class="py-2">
                    <v-text-field v-model="formaGrupa.naziv" label="Naziv (npr. Seniori)" variant="outlined" color="primary" rounded="lg"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="py-2">
                    <v-select v-model="formaGrupa.trener_id" :items="treneri" item-title="prezime" item-value="id" label="Odaberi trenera" variant="outlined" color="primary" rounded="lg"></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="px-4 font-weight-bold" @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="primary" variant="elevated" class="px-6 font-weight-bold" rounded="lg" elevation="2" @click="spremiGrupu">Spremi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="420px">
          <v-card rounded="xl" class="pa-4">
            <div class="text-center pa-4">
              <v-icon color="error" size="64" class="mb-3 animate-pulse">mdi-alert-circle-outline</v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">Potvrda brisanja</h3>
              <p class="text-body-1 text-medium-emphasis">Jeste li sigurni da želite ukloniti ovu grupu?</p>
            </div>
            <v-card-actions class="px-4 pb-2">
              <v-btn color="grey-darken-1" variant="text" class="flex-grow-1 font-weight-bold" @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="elevated" class="flex-grow-1 font-weight-bold" rounded="lg" @click="obrisiGrupu">Ukloni</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const grupe = ref([])
const treneri = ref([]) 

const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

const formaGrupa = ref({ id: null, naziv: '', trener_id: null })

const dohvatiGrupe = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/grupe')
  grupe.value = await res.json()
}

const dohvatiTrenere = async () => {
  const res = await fetch('http://127.0.0.1:5000/api/treneri')
  treneri.value = await res.json()
}

const nadiImeTrenera = (id) => {
  const t = treneri.value.find(x => x.id === id)
  return t ? `${t.ime} ${t.prezime}` : 'Nema trenera'
}

const otvoriDodavanje = () => {
  isEditing.value = false
  formaGrupa.value = { id: null, naziv: '', trener_id: null }
  dialog.value = true
}

const pripremiUredivanje = (grupa) => {
  isEditing.value = true
  formaGrupa.value = { ...grupa }
  dialog.value = true
}

const spremiGrupu = async () => {
  const metoda = isEditing.value ? 'PUT' : 'POST'
  const url = isEditing.value 
    ? `http://127.0.0.1:5000/api/grupe/${formaGrupa.value.id}` 
    : 'http://127.0.0.1:5000/api/grupe'

  await fetch(url, {
    method: metoda,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formaGrupa.value)
  })
  
  zatvoriDialog()
  dohvatiGrupe()
}

const zatvoriDialog = () => { dialog.value = false }

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiGrupu = async () => {
  await fetch(`http://127.0.0.1:5000/api/grupe/${idZaBrisanje.value}`, { method: 'DELETE' })
  dialogBrisanje.value = false
  dohvatiGrupe()
}

onMounted(() => {
  dohvatiTrenere().then(() => dohvatiGrupe())
})
</script>

<style scoped>
.text-gradient { background: linear-gradient(45deg, #1867C0, #5CBBF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.btn-gradient { background: linear-gradient(45deg, #1867C0, #2196F3) !important; transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
.btn-gradient:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4) !important; }
.table-row-animate { transition: background-color 0.25s ease, transform 0.2s ease; }
.table-row-animate:hover { background-color: #F8FAFC !important; transform: scale(1.005); }
.action-btn { transition: transform 0.2s ease !important; }
.action-btn:hover { transform: scale(1.15); }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
.animate-pulse { animation: pulse 2s infinite ease-in-out; }
.border-light { border: 1px solid rgba(0,0,0,0.05); }
.shadow-sm { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
</style>