import entriesService from '../services/entries'
import users from '../services/users'
import usersService from '../services/users'

import { useState, useEffect } from 'react'

const Entry = ({ entry, postedMessage, showPostToolbar, showRedHeart, setUserLikedEntries }) => {
    const [totalLikes, setTotalLikes] = useState(entry.likes)
    const [likeDisabled, setLikeDisabled] = useState(false)

    const handleLike = async (entryId) => {
        setLikeDisabled(true)

        const entry = await entriesService.getOne(entryId) 
        const user = await usersService.getCurrentUser()

        let entryLikedByArr = entry.likedBy
        let userLikedArr = user.likes
        let likesIncrement = 0

        if (entryLikedByArr.includes(user.id)) {
            entryLikedByArr = entryLikedByArr.filter(id => id !== user.id)
            likesIncrement = -1
        } else {
            entryLikedByArr = entryLikedByArr.concat(user.id)
            likesIncrement = 1
        }

        if (userLikedArr.includes(entryId)) {
            userLikedArr = userLikedArr.filter(id => id !== entryId)
        } else {
            userLikedArr = userLikedArr.concat(entryId)
        }

        const updatedUserDetails = {
            likes: userLikedArr
        }

        const updatedEntryDetails = {
            likedBy: entryLikedByArr,
            likes: totalLikes + likesIncrement
        }

        
        await usersService.updateOne(updatedUserDetails)
        await entriesService.updateOne(entryId, updatedEntryDetails)
        setTotalLikes(likesIncrement + totalLikes)
        setUserLikedEntries(userLikedArr)

        setTimeout(() => {
            setLikeDisabled(false)
        }, 500)
    }


    return (
        <div className='entries-display-entry pop' key={entry.id}>
            <h2 className="title">{entry.title} <span className="title-date wrap">• Posted {postedMessage} • Author: {entry.user.username}</span></h2> 
            <hr></hr>
            <p className="content">{entry.content}</p>

            {
                showPostToolbar && 
                <div className="post-toolbar">
                    <button className="post-toolbar-likes" onClick={likeDisabled ? undefined : () => handleLike(entry.id)}>
                        {/* heart */}
                        <svg className="post-toolbar-likes-heart logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={showRedHeart ? "red" : "none"} stroke="black" >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/> 
                        </svg>
                        {totalLikes}
                    </button>

                    <button>
                        {/* comment logo */}
                        <svg className="post-toolbar-likes-bubble logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black">
                            <path d="M2 3c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-4l-4 4-4-4H4c-1.1 0-2-.9-2-2V3z"/>
                        </svg>
                        8
                    </button>

                    <button>
                        <svg className="logo" viewBox="0 0 24 24" id="bookmark" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="black">
                            <path id="primary" d="M12,17,5,21V4A1,1,0,0,1,6,3H18a1,1,0,0,1,1,1V21Z"></path>
                        </svg>
                        Save
                    </button>
                    
                </div>
            }
        </div>
    )
}

const EntriesDisplay = ({ entries, showPostToolbar, userLikedEntries, setUserLikedEntries, nowDisplaying }) => {

    const timeSincePost = (timePosted) => {
        const timeCurrent = new Date().getTime()

        const secondsElapsed = (timeCurrent - timePosted) / 1000

        console.log('Seconds elapsed:', secondsElapsed)
        let message = ''
        if (secondsElapsed < 60) {
            message = 'just now'
        } else if (secondsElapsed < 3600) {
            message = `${parseInt(secondsElapsed / 60)} minutes ago`
        } else if (secondsElapsed < 86400) {
            message = `${parseInt(secondsElapsed / 3600)} hour(s) ago`
        } else {
            message = `${parseInt(secondsElapsed / 86400)} day(s) ago`
        }

        return message
    }

    return (
        <div>
            <h1 className="half-margin">{nowDisplaying}</h1>
            <div className="entries-display">
            {
            [...entries].reverse().map(entry => (
                <Entry key={entry.id} entry={entry} postedMessage={timeSincePost(entry.date)} showPostToolbar={showPostToolbar} showRedHeart={userLikedEntries.includes(entry.id) ? true : false} setUserLikedEntries={setUserLikedEntries}/>
            ))    
            }       
        </div>
      </div>
       
    )
}

export default EntriesDisplay