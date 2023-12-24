//
//  Round.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 24/12/2023.
//

import Foundation
import SwiftData

@Model
class Round {
    var roundNumber: Int
    var score: Int
    
    init(roundNumber: Int, score: Int) {
        self.roundNumber = roundNumber
        self.score = score
    }
}
