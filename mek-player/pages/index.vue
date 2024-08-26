<template>
    <h1>Hangoskönyvek</h1>
    <BContainer>
        <BRow>
            <BCol>
                <BFormInput v-model="filter" placeholder="Keresés" />
            </BCol>
        </BRow>
        <BTable :sort-by="[{ key: 'title', order: 'asc' }]" :sort-internal="true" :items="bookList" :fields="sortFields"
            :filter="filter" :per-page="perPage" :current-page="currentPage" @filtered="onFiltered" select-mode="single"
            ref="selectableTable" selectable @row-clicked="onRowClicked" />
        <BRow>
            <BCol>
                <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" :align="'fill'" size="sm"
                    class="my-0" />
            </BCol>
        </BRow>
    </BContainer>
</template>
<script setup lang="ts">
import axios from 'axios';
import {
    BButton,
    BCol,
    BContainer,
    BFormInput,
    BPagination,
    BRow,
    BTable,
    type TableFieldRaw,
    type TableItem
} from 'bootstrap-vue-next';
import { ref } from 'vue';

interface BookListItem {
    id: string
    title: string
    author: string
    lead: string
    cover: string
}
const bookList = ref([{}] as BookListItem[])
const currentPage = ref(1)
const totalRows = ref(100)
const perPage = ref(50)
const filter = ref('')

const sortFields: Exclude<TableFieldRaw<BookListItem>, string>[] = [
    { key: 'title', sortable: true, label: 'Cím' },
    { key: 'author', sortable: true, label: 'Szerző' }
]

async function fetchData() {
    try {
        window.location.href.startsWith('http://localhost') ? axios.defaults.baseURL = 'http://localhost:3000' : axios.defaults.baseURL = 'https://bartlbalazs.github.io/mekjatszo/'
        const bookListRespone = await axios.get<BookListItem[]>('/static/full_list.json')
        if (bookListRespone.data) {
            totalRows.value = bookListRespone.data.length;
            bookList.value = bookListRespone.data;
        }
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    fetchData()
})

function onFiltered(filteredItems: TableItem<BookListItem>[]) {
    totalRows.value = filteredItems.length
}

async function onRowClicked(item: TableItem<BookListItem>) {
    await navigateTo('/books/' + item.id)
}

</script>