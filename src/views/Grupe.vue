<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-5 mt-5">Grupe</h1>
        
        <v-btn color="primary" class="mb-4" @click="otvoriDodavanje">
          Dodaj novu grupu
        </v-btn>

        <v-table class="elevation-1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv Grupe</th>
              <th>Trener (Zadužen)</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grupa in grupe" :key="grupa.id">
              <td>{{ grupa.id }}</td>
              <td>{{ grupa.naziv }}</td>
              <td>{{ nadiImeTrenera(grupa.trener_id) }}</td>
              <td>
                <v-btn color="warning" size="small" class="mr-2" @click="pripremiUredivanje(grupa)">Uredi</v-btn>
                <v-btn color="error" size="small" @click="pripremiBrisanje(grupa.id)">Obriši</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ isEditing ? 'Uredi Grupu' : 'Nova Grupa' }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="formaGrupa.naziv" label="Naziv grupe (npr. Mlađi Kadeti)" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="formaGrupa.trener_id"
                      :items="treneri"
                      item-title="punoIme"
                      item-value="id"
                      label="Odaberi trenera"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="zatvoriDialog">Odustani</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="spremiGrupu">Spremi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBrisanje" max-width="400px">
          <v-card>
            <v-card-title class="text-h6">Potvrda brisanja</v-card-title>
            <v-card-text>Jeste li sigurni da želite obrisati ovu grupu?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="dialogBrisanje = false">Odustani</v-btn>
              <v-btn color="error" variant="text" @click="obrisiGrupu">Obriši</v-btn>
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
const treneri = ref([]) // Ovdje čuvamo listu trenera za dropdown

const dialog = ref(false)
const dialogBrisanje = ref(false)
const isEditing = ref(false)
const idZaBrisanje = ref(null)

const formaGrupa = ref({
  id: null,
  naziv: '',
  trener_id: null
})

// Dohvaćamo Grupe iz baze
const dohvatiGrupe = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/grupe')
    grupe.value = await response.json()
  } catch (error) {
    console.error("Greška pri dohvaćanju grupa:", error)
  }
}

// Dohvaćamo Trenere da napunimo padajući izbornik
const dohvatiTrenere = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/treneri')
    const data = await response.json()
    // Spajamo ime i prezime da ljepše izgleda u izborniku
    treneri.value = data.map(t => ({
      ...t,
      punoIme: `${t.ime} ${t.prezime}`
    }))
  } catch (error) {
    console.error("Greška pri dohvaćanju trenera:", error)
  }
}

// Funkcija koja pronalazi ime trenera po ID-u (za prikaz u tablici)
const nadiImeTrenera = (id) => {
  const trener = treneri.value.find(t => t.id === id)
  return trener ? trener.punoIme : 'Nepoznato'
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
  try {
    if (isEditing.value) {
      await fetch(`http://127.0.0.1:5000/api/grupe/${formaGrupa.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formaGrupa.value)
      })
    } else {
      await fetch('http://127.0.0.1:5000/api/grupe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formaGrupa.value)
      })
    }
    zatvoriDialog()
    dohvatiGrupe()
  } catch (error) {
    console.error("Greška pri spremanju:", error)
  }
}

const zatvoriDialog = () => { dialog.value = false }

const pripremiBrisanje = (id) => {
  idZaBrisanje.value = id
  dialogBrisanje.value = true
}

const obrisiGrupu = async () => {
  try {
    await fetch(`http://127.0.0.1:5000/api/grupe/${idZaBrisanje.value}`, {
      method: 'DELETE'
    })
    dialogBrisanje.value = false
    dohvatiGrupe()
  } catch (error) {
    console.error("Greška pri brisanju:", error)
  }
}

// Kada se stranica učita, dohvati i grupe i trenere!
onMounted(() => {
  dohvatiTrenere().then(() => {
    dohvatiGrupe()
  })
})
</script>