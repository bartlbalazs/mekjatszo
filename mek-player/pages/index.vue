<template>
    <h1>Hangoskönyvek</h1>
    <BContainer>
        <BRow>
            <BCol>
                <BFormInput v-model="filter" placeholder="Keresés" />
            </BCol>
        </BRow>
        <BTable :sort-by="[{ key: 'author', order: 'asc' }]" :sort-internal="true" :items="bookList"
            :fields="sortFields" :filter="filter" :per-page="perPage" :current-page="currentPage"
            @filtered="onFiltered" />
        <BRow>
            <BCol>
                <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" :align="'fill'" size="sm"
                    class="my-0" />
            </BCol>
        </BRow>
    </BContainer>
</template>
<script setup lang="ts">
import {
    BButton,
    BCol,
    BFormInput,
    BPagination,
    BRow,
    BContainer,
    BTable,
    type BTableSortBy,
    type TableFieldRaw,
    type TableItem,
} from 'bootstrap-vue-next'
import { reactive, ref } from 'vue'
import axios from 'axios'

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
    { key: 'title', sortable: true },
    { key: 'author', sortable: true }
]

async function fetchData() {
    try {
        const bookListRespone = await axios.get<BookListItem[]>('/static/full_list.json')
        if (bookListRespone.data) {
            bookListRespone.data.sort((a: BookListItem, b: BookListItem) => a.title.localeCompare(b.title));
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

</script>