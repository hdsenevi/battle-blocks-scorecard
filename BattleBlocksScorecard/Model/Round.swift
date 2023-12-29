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
    var name: String
    var roundNumber: Int
    var score: Int
    
    init(name: String = "", roundNumber: Int, score: Int) {
        self.name = name
        self.roundNumber = roundNumber
        self.score = score
    }
}
