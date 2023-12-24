//
//  Participents.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 24/12/2023.
//

import Foundation
import SwiftData

@Model
class Participent {
    var name: String
    
    init(name: String) {
        self.name = name
    }
}
