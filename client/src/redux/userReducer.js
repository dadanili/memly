//reducer functions to modify state tree

// ------ ACTIONS FOR USER REDUCER --------- //
export function userAuth (userID) {
  return {
    type: 'USER_AUTH',
    isLoggedIn: true,
    userID
  }
}

export function toggleLogIn(bool){
  return {
    type: 'TOGGLE_LOGIN',
    isLoggedIn: bool,
  }
}

export function userUnauth () {
  return {
    type: 'USER_UNAUTH',
    isLoggedIn: false,
  }
}

export function fetchUserSuccess (user) {
  return {
    type: 'FETCHING_USER_SUCCESS',
    user,
  }
}
// console.log('whaaaa',fetchUserSuccess('dani'))

export function updateUserLocation (userLocation) {
  return {
    type: 'UPDATE_USER_LOCATION',
    userLocation,
  }
}

export function updateUserFacebook (userFacebook) {
  console.log('================', userFacebook)
  return {
    type: 'UPDATE_USER_FACEBOOK',
    userFacebook,
  }
}

export function updateUserBirthday (birthday) {
  return {
    type: 'UPDATE_USER_BIRTHDAY',
    birthday,
  }
}

export function likeMemly(memlyId) {
  return {
    type: 'UPDATE_LIKED_MEMLYS',
    memlyId,
  }
}

export function dislikeMemly(memlyId) {
  return {
    type: 'UPDATE_DISLIKED_MEMLYS',
    memlyId,
  }
}

export function updateMemlyCount(memlyCount) {
  return {
    type: 'UPDATE_MEMLY_COUNT',
    memlyCount,
  }
}

export function increaseMemlyCount() {
  return {
    type: 'INCREASE_MEMLY_COUNT',
  }
}

export function setJourneys(journeys) {
 return {
    type: 'SET_JOURNEYS',
    journeys
  }
}

export function setCurrentJourney(journeyIndex, callfrom) {
  return {
    type: 'SET_CURRENT_JOURNEY',
    journeyIndex,
    callfrom
  }
}

// ----- SET USER REDUCER INITIAL STATE ------ //
const userInitialState = {
  userID: '',
  user: {},
  userFacebook: {},
  memlyCount: 0,
  isLoggedIn: false,
  error: '',
  likedMemlys: [],
  dislikedMemlys: [],
  myJourneys: [],
  userLocation: {
    lat: '',
    lng: '',
  },
  birthday: '',
  allMemlys: [],
  selection: [],
  pageIndex: 0,
  currentJourney: {},
  nearbyJourneys: [],
  favouriteJourneys: [],
  recommendations: []
  query: ''
}

// ------------ USER REDUCER -----------------//
export default function userReducer (state = userInitialState, action) {
  switch(action.type){
   case 'WATSON_QUERY_PERSONALITY' : {
     return {
       ...state, 
       query: action.query
     }
   }
   case 'PHOTO_RECOMMENDATIONS' : {
     return {
       ...state, 
       recommendations: action.recommendations
     }
   }
   case 'USER_LIST_MEMLYS' : {
     return {
       ...state, 
       allMemlys: action.memlys
     }
   }

  case 'SELECTED_MEMLYS' : {
    return {
      ...state, 
      selection: action.selection
    }
  }

   case 'USER_AUTH' :  
    return {
      ...state, 
      isLoggedIn: true,

    }

    case 'USER_UNAUTH' : {
      return {
        ...state,
        isLoggedIn: false,
        user: {},
        userID: '',
      }
    }

    case 'TOGGLE_LOGIN' : {
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      }
    }

    case 'FETCHING_USER_INFO' : {
      return {
        ...state,
        isFetching: true,
      }
    }

    case 'FETCHING_USER_INFO_ERROR' : {
      return {
        ...state,
        isFetching: false, 
        error: action.error, 
      }
    }

    case 'FETCHING_USER_SUCCESS' : {
      if (action.user === null) {
        return {
          ...state,
          user: action.user,
          isFetching: false, 
          error: '',
        }
      } else {
        if(action.userID = state.userID) {
          return {
            ...state, 
            isFetching: false, 
            info: action.user,
          }
        }
      }
    }

    case 'UPDATE_USER_LOCATION' : {
      // action should have userLocation property in the form of {lat: '', lng: ''}
      return {
        ...state,
        userLocation: action.UserLocation,
      }
    }

    case 'UPDATE_USER_FACEBOOK' : {
      return {
        ...state,
        userFacebook: action.userFacebook,
      }
    }

    case 'UPDATE_USER_BIRTHDAY' : {
      return {
        ...state,
        birthday: action.birthday,
      }
    }

    case 'UPDATE_LIKED_MEMLYS' : {
      return {
        ...state,
        likedMemlys: [...state.likedMemlys, action.memlyId]
      }
    }

    case 'UPDATE_DISLIKED_MEMLYS' : {
      return {
        ...state,
        dislikedMemlys: [...state.likedMemlys, action.memlyId]
      }
    }

    case 'UPDATE_MEMLY_COUNT' : {
      return {
        ...state,
        memlyCount: action.memlyCount,
      }
    }

    case 'INCREASE_MEMLY_COUNT' : {
      return {
        ...state,
        memlyCount: action.memlyCount ++
      }
    }

    case 'SET_JOURNEYS' : {
      return {
        ...state,
        journeys: action.journeys
      }
    }

    case 'SET_CURRENT_JOURNEY' : {
      if (action.callfrom === "myJourneys") {
        return {
          ...state,
          currentJourney: state.journeys[action.journeyIndex]
        }
      } else {
        return {
          ...state,
          currentJourney: state.favouriteJourneys[action.journeyIndex]
        }
      }
    }

    case 'SET_NEARBY_JOURNEYS': {
      return {
        ...state,
        nearbyJourneys: action.journeys
      }
    }

    case 'ADD_FAVOURITE_JOURNEY': {
      return {
        ...state,
        favouriteJourneys: state.favouriteJourneys.concat([state.nearbyJourneys[action.index]])
      }
    }

    default : {
      return state
    }
  }
};