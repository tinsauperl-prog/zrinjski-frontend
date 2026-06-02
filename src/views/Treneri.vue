<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">

        <div class="d-flex align-center justify-space-between mb-8 header-section">
          <div>
            <h1 class="text-h3 font-weight-black text-gradient mb-1">Treneri</h1>

          </div>
          <v-btn class="btn-gradient text-white font-weight-bold px-6" elevation="4" rounded="xl" size="large"
            @click="otvoriDodavanje">
            <v-icon start size="22">mdi-plus</v-icon>
            Novi trener
          </v-btn>
        </div>

        <v-card elevation="2" rounded="xl" class="custom-table-card overflow-hidden">
          <v-table class="modern-table">
            <thead>
              <tr>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4 pl-6">ID</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Ime i prezime</th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4">Status licence
                </th>
                <th class="text-subtitle-2 font-weight-bold text-uppercase text-medium-emphasis py-4 text-right pr-6">
                  Akcije</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trener in treneri" :key="trener.id" class="table-row-animate">
                <td class="text-medium-emphasis font-weight-medium pl-6">#{{ trener.id }}</td>

                <td>
                  <div class="d-flex align-center py-3">
                    <v-avatar class="avatar-gradient text-white mr-4 shadow-sm" size="44">
                      <span class="font-weight-bold text-body-1">
                        {{ trener.ime.charAt(0) }}{{ trener.prezime.charAt(0) }}
                      </span>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold text-subtitle-1 text-high-emphasis">{{ trener.ime }} {{
                        trener.prezime }}</div>
                      <div class="text-caption text-medium-emphasis">Član trenerskog tima</div>
                    </div>
                  </div>
                </td>

                <td>
                  <v-chip color="teal-darken-1" size="md" variant="tonal" class="font-weight-bold px-3 rounded-lg"
                    prepend-icon="mdi-shield-check">
                    {{ trener.certifikat }}
                  </v-chip>
                </td>

                <td class="text-right pr-6">
                  <v-btn icon variant="text" color="blue-darken-1" class="mr-1 action-btn"
                    @click="pripremiUredivanje(trener)" title="Uredi">
                    <v-icon size="22">mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn icon variant="text" color="red-lighten-1" class="action-btn"
                    @click="pripremiBrisanje(trener.id)" title="Obriši">
                    <v-icon size="22">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="520px" transition="dialog-bottom-transition">
          <v-card rounded="xl" class="pa-4 border-light">
            <v-card-title class="d-flex justify-between align-center pa-4">
              <span class="text-h5 font-weight-black text-high-emphasis">
                {{ isEditing ? 'Ažuriraj trenera' : 'Registriraj trenera' }}
              </span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-container class="px-0 py-0">
                <v-row>
                  <v-col cols="12" sm="6" class="py-2">
                    <v-text-field v-model="formaTrener.ime" label="Ime" variant="outlined" color="primary"
                      rounded="lg"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" class="py-2">
                    <v-text-field v-model="formaTrener.prezime" label="Prezime" variant="outlined" color="primary"
                      rounded="lg"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="py-2">
                    <v-text-field v-model="formaTrener.certifikat" label="Certifikat / Licenca" variant="outlined"
                      color="primary" rounded="lg" prepend-inner-icon="mdi-certificate-outline"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="px-4 font-weight-bold"
                @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="primary" variant="elevated" class="px-6 font-weight-bold" rounded="lg" elevation="2"
                @click="spremiTrenera">Spremi promjene</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="420px">
          <v-card rounded="xl" class="pa-4">
            <div class="text-center pa-4">
              <v-icon color="error" size="64" class="mb-3 animate-pulse">mdi-alert-circle-outline</v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">Potvrda brisanja</h3>
              <p class="text-body-1 text-medium-emphasis">Jeste li sigurni da želite ukloniti ovog trenera? Ova akcija
                trajno briše podatke iz sustava.</p>
            </div>
            <v-card-actions class="px-4 pb-2">
              <v-btn color="grey-darken-1" variant="text" class="flex-grow-1 font-weight-bold"
                @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="elevated" class="flex-grow-1 font-weight-bold" rounded="lg"
                @click="obrisiTrenera">Ukloni</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const treneri = ref([])
const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

const formaTrener = ref({ id: null, ime: '', prezime: '', certifikat: '' })

const dohvatiTrenere = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/treneri')
    treneri.value = await response.json()
  } catch (error) {
    console.error("Greška pri dohvaćanju:", error)
  }
}

const otvoriDodavanje = () => {
  isEditing.value = false
  formaTrener.value = { id: null, ime: '', prezime: '', certifikat: '' }
  dialog.value = true
}

const pripremiUredivanje = (trener) => {
  isEditing.value = true
  formaTrener.value = { ...trener }
  dialog.value = true
}

const spremiTrenera = async () => {
  try {
    const metoda = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value ? `http://127.0.0.1:5000/api/treneri/${formaTrener.value.id}` : 'http://127.0.0.1:5000/api/treneri'

    await fetch(url, {
      method: metoda,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formaTrener.value)
    })
    zatvoriDialog()
    dohvatiTrenere()
  } catch (error) {
    console.error("Greška pri spremanju:", error)
  }
}

const zatvoriDialog = () => { dialog.value = false }

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiTrenera = async () => {
  try {
    await fetch(`http://127.0.0.1:5000/api/treneri/${idZaBrisanje.value}`, { method: 'DELETE' })
    dialogBrisanje.value = false
    dohvatiTrenere()
  } catch (error) {
    console.error("Greška pri brisanju:", error)
  }
}

onMounted(() => { dohvatiTrenere() })
</script>

<style scoped>
/* Gradient tekst za naslov */
.text-gradient {
  background: linear-gradient(45deg, #1867C0, #5CBBF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Premium gradient za gumb */
.btn-gradient {
  background: linear-gradient(45deg, #1867C0, #2196F3) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4) !important;
}

/* Gradient za okrugli avatar trenera */
.avatar-gradient {
  background: linear-gradient(135deg, #1867C0, #00E676) !important;
}

/* Glatke animacije redova u tablici na hover */
.table-row-animate {
  transition: background-color 0.25s ease, transform 0.2s ease;
}

.table-row-animate:hover {
  background-color: #F8FAFC !important;
  transform: scale(1.005);
}

/* Animacija za gumbe akcija (olovka i kanta) */
.action-btn {
  transition: transform 0.2s ease !important;
}

.action-btn:hover {
  transform: scale(1.15);
}

/* Suptilni pulsirajući efekt za ikonu brisanja */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.animate-pulse {
  animation: pulse 2s infinite ease-in-out;
}

.border-light {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.shadow-sm {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>