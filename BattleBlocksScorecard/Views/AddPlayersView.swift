//
//  AddPlayersView.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 26/12/2023.
//

import SwiftUI
import SwiftData

struct AddPlayersView: View {
    @Environment(\.dismiss) var dismiss
    @Environment(\.modelContext) var modelContext
    
    @State private var name = ""
    @FocusState private var focused: Bool
    
    var body: some View {
        VStack(alignment: .leading) {
            Form {
                Section("Add a new player") {
                    TextField("New player name", text: $name)
                        .focused($focused)
                        .submitLabel(.return)
                }
                .onSubmit {
                    addNewPlayer()
                }
            }
        }
        .navigationTitle("Add a new player")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Add", action: addNewPlayer)
                    .disabled(name.count == 0)
            }
        }
    }
    
    func addNewPlayer() {
        focused = false
        
        let player = Player(name: name)
        name = ""
        modelContext.insert(player)
        do {
            print("About to save player \(player.name)")
            try modelContext.save()
        } catch {
            print("Error while saving player \(error.localizedDescription)")
        }
        
        dismiss()
    }
}

#Preview {
    NavigationView {
        AddPlayersView()
    }
}
