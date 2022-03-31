import { httpService } from './http-service.js';
import { utilService } from './utils-service.js';

export const boardService = {
    getBoards,
    removeBoard,
    saveBoard,
    getBoardById,
    getEmptyBoard,
    getEmptyGroup,
    addActivity
}

function getBoards(filterBy) {
    var queryStr = '';
    return httpService.get(`board`);
}

function getBoardById(boardId) {
    if (boardId) return httpService.get(`board/${boardId}`);
}

function removeBoard(boardId) {
    return httpService.delete(`board/${boardId}`);
}

function saveBoard(board) {
    if (board._id) return httpService.put(`board/${board._id}`, board);
    return httpService.post(`board`, board);
}

function getEmptyGroup(title = '', tasks = []) {
    return {
        _id: utilService.makeId(),
        title,
        tasks,
    };
}

function addActivity(activityTxt, byMember, item, boardId) {
    return {
        _id: utilService.makeId(),
        byMember,
        txt: activityTxt,
        item,
        createdAt: Date.now(),
        boardId
    }
}

function getEmptyBoard() {
    return Promise.resolve({
        title: '',
        isFavorite: false,
        createdBy: '',
        style: {
            bgColor: '#cacabb',
        },
        labels: [
            {
                "color": "#f5dd29",
                "title": "Day",
                "_id": "l102"
            },
            {
                "color": "#a7ffeb",
                "title": "Remarket",
                "_id": "l103"
            },
            {
                "color": "#d7aefb",
                "title": "Demand Marketing",
                "_id": "enT4D7oh"
            },
            {
                "color": "#33a9bb",
                "title": "Partners",
                "_id": "rtbnYyfi"
            },
            {
                "color": "#16243d",
                "title": "Government",
                "_id": "5leaLS2n"
            },
            {
                "color": "#f28b82",
                "title": "Planning",
                "_id": "NuwdhQ9L"
            }
        ],
        members: [],
        groups: [
            {
                _id: utilService.makeId(),
                title: 'New List',
                tasks: [],
            },
        ],
        activities: []
    });
}